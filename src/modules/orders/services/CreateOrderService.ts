import CustomersRepository from '@modules/customers/typeorm/repositories/CustomersRepository';
import { ProductRepository } from '@modules/products/typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Order from '../typeorm/entities/Order';
import OrdersRepository from '../typeorm/repositories/OrdersRepository';

interface IProduct {
	id: string;
	quantity: number;
}

interface IRequest {
	customer_id: string;
	products: IProduct[];
}

class CreateOrderService {
	public async execute({ customer_id, products }: IRequest): Promise<Order> {
		const ordersRepository = getCustomRepository(OrdersRepository);
		const customerRepository = getCustomRepository(CustomersRepository);
		const productsRepository = getCustomRepository(ProductRepository);

		const customerExists = await customerRepository.findById(customer_id);

		if (!customerExists) {
			throw new AppError('There is no exists customer');
		}

		const existsProduct = await productsRepository.findAllByIds(products);

		if (!existsProduct.length) {
			throw new AppError('There is no exists products ids');
		}

		const existsProductsIds = existsProduct.map(p => p.id);

		const checkInexistentProducts = products.filter(
			p => !existsProductsIds.includes(p.id),
		);

		if (checkInexistentProducts.length) {
			throw new AppError(
				`Could not find product ${checkInexistentProducts[0].id}`,
			);
		}

		const quantityAvailable = products.filter(
			p =>
				existsProduct.filter(pr => pr.id === p.id)[0].quantity <
				p.quantity,
		);

		if (quantityAvailable.length) {
			throw new AppError(
				`The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}`,
			);
		}

		const serializedProducts = products.map(p => ({
			product_id: p.id,
			quantity: p.quantity,
			price: existsProduct.filter(pr => pr.id === p.id)[0].price,
		}));

		const order = await ordersRepository.createOrder({
			customer: customerExists,
			products: serializedProducts,
		});
		console.log(order);
		await ordersRepository.save(order);

		const { orderProducts } = order;
		const updatedProductQuantity = orderProducts.map(p => {
			return {
				id: p.product_id,
				quantity:
					existsProduct.filter(pr => pr.id === p.product_id)[0]
						.quantity - p.quantity,
			};
		});

		await productsRepository.save(updatedProductQuantity);

		return order;
	}
}

export default CreateOrderService;
