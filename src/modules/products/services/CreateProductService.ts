import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';

interface IRequest {
	name: string;
	price: number;
	quantity: number;
}

class CreateProductService {
	public async execute({
		name,
		price,
		quantity,
	}: IRequest): Promise<Product> {
		const productRepository = getCustomRepository(ProductRepository);
		const keyList = 'api-vendas-PRODUCT_LIST';
		const productExists = await productRepository.findByName(name);

		if (productExists) {
			throw new AppError('There is already one product with his name');
		}

		const redisCache = new RedisCache();
		const product = productRepository.create({
			name,
			price,
			quantity,
		});

		await redisCache.invalidate(keyList);
		await productRepository.save(product);

		return product;
	}
}

export default CreateProductService;
