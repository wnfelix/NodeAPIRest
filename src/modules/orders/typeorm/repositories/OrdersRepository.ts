import Customer from '@modules/customers/typeorm/entities/Customer';
import { EntityRepository, Repository } from 'typeorm';
import Order from '../entities/Order';

interface IProduct {
	product_id: string;
	price: number;
	quantity: number;
}

interface IRequest {
	customer: Customer;
	products: IProduct[];
}

@EntityRepository(Order)
export default class OrdersRepository extends Repository<Order> {
	public async findByName(id: string): Promise<Order | undefined> {
		const product = this.findOne(id, {
			relations: ['orderProducts', 'customer'],
		});

		return product;
	}

	public async createOrder({ customer, products }: IRequest): Promise<Order> {
		const order = this.create({
			customer,
			orderProducts: products,
		});

		await this.save(order);

		return order;
	}

	public async findById(id: string): Promise<Order | undefined> {
		const order = await this.findOne(id, {
			relations: ['orderProducts', 'customer'],
		});

		return order;
	}
}
