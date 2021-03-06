import Product from '@modules/products/typeorm/entities/Product';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import Order from './Order';

@Entity('order_products')
class OrderProducts {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Order, order => order.orderProducts)
	@JoinColumn({ name: 'order_id' })
	order: Order;

	@ManyToOne(() => Product, product => product.orderProducts)
	@JoinColumn({ name: 'product_id' })
	product: Product;

	@Column()
	order_id: string;

	@Column()
	product_id: string;

	@Column('decimal')
	price: number;

	@Column('int')
	quantity: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}

export default OrderProducts;
