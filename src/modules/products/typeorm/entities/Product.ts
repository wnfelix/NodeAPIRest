import OrderProducts from '@modules/orders/typeorm/entities/OrdersProducts';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('products')
class Product {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToMany(() => OrderProducts, order_products => order_products.product)
	@JoinColumn({ name: 'product_id' })
	orderProducts: OrderProducts[];

	@Column()
	name: string;

	@Column('decimal')
	price: number;

	@Column('int')
	quantity: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}

export default Product;
