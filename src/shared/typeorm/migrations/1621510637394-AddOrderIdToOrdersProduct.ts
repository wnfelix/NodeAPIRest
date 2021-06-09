import {
	MigrationInterface,
	QueryRunner,
	TableColumn,
	TableForeignKey,
} from 'typeorm';

export class AddOrderIdToOrdersProduct1621510637394
	implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			'order_products',
			new TableColumn({
				name: 'order_id',
				type: 'uuid',
				isNullable: true,
			}),
		);

		await queryRunner.createForeignKey(
			'order_products',
			new TableForeignKey({
				name: 'OrdersProductsOrders',
				columnNames: ['order_id'],
				referencedTableName: 'orders',
				referencedColumnNames: ['id'],
				onDelete: 'SET NULL',
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropForeignKey(
			'order_products',
			'OrdersProductsOrders',
		);
		await queryRunner.dropColumn('order_products', 'order_id');
	}
}
