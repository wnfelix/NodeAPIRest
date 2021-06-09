import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';

interface IRequest {
	id: string;
	name: string;
	price: number;
	quantity: number;
}

class UpdateProductService {
	public async execute({
		id,
		name,
		price,
		quantity,
	}: IRequest): Promise<Product | undefined> {
		const productRepository = getCustomRepository(ProductRepository);
		const keyList = 'api-vendas-PRODUCT_LIST';
		const product = await productRepository.findOne(id);

		if (!product) {
			throw new AppError('product not found');
		}

		const productExists = await productRepository.findByName(name);

		if (productExists) {
			throw new AppError('There is already one product with his name');
		}

		product.name = name;
		product.price = price;
		product.quantity = quantity;


		const redisCache = new RedisCache();

		await redisCache.invalidate(keyList);
		await productRepository.save(product);

		return product;
	}
}

export default UpdateProductService;
