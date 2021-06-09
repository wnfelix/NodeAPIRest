import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import RedisCache from '@shared/cache/RedisCache';

class ListProductService {
	public async execute(): Promise<Product[]> {
		const productRepository = getCustomRepository(ProductRepository);
		const keyList = 'api-vendas-PRODUCT_LIST';
		const redisCache = new RedisCache();

		let products = await redisCache.recover<Product[]>(
			keyList,
		);

		if (!products) {
			products = await productRepository.find();
		}

		await redisCache.save(keyList, products);

		return products;
	}
}

export default ListProductService;
