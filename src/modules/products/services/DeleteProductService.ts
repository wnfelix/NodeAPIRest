import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';

interface IRequest {
	id: string;
}
class DeleteProductService {
	public async execute({ id }: IRequest): Promise<void> {
		const productRepository = getCustomRepository(ProductRepository);
		const keyList = 'api-vendas-PRODUCT_LIST';
		const product = await productRepository.findOne(id);

		if (!product) {
			throw new AppError('product not found');
		}

		const redisCache = new RedisCache();

		await redisCache.invalidate(keyList);
		await productRepository.remove(product);

	}
}

export default DeleteProductService;
