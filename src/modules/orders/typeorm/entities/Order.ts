import Customer from '@modules/customers/typeorm/entities/Customer';
import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import OrderProducts from './OrdersProducts';

@Entity('orders')
class Order {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Customer)
	@JoinColumn({ name: 'customer_id' })
	customer: Customer;

	@OneToMany(() => OrderProducts, order_products => order_products.order, {
		cascade: true,
	})
	orderProducts: OrderProducts[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}

export default Order;
