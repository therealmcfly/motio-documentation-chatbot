import { createPool, Pool, PoolConnection } from 'mysql';
import config from "../config/config";

class MySqlConnector {
	private pool: Pool;
	constructor(mysqlInfo: any) {
		/**
	 * generates pool connection to be used throughout the app
	 */
		try {
			this.pool = createPool({
				//connectionLimit: process.env.MY_SQL_DB_CONNECTION_LIMIT,
				host: mysqlInfo.host,
				user: mysqlInfo.user,
				password: mysqlInfo.password,
				database: mysqlInfo.database,
			});

			console.debug('MySql Adapter Pool generated successfully');
		} catch (error) {
			console.error('[mysql.connector][init][Error]: ', error);
			throw new Error('failed to initialized pool');
		}
	}

	/**
	 * executes SQL queries in MySQL db
	 *
	 * @param {string} query - provide a valid SQL query
	 * @param {string[] | Object} params - provide the parameterized values used
	 * in the query
	 */
	public execute = <T>(query: string, params: string[] | Object): Promise<T> => {
		try {
			if (!this.pool) throw new Error('Pool was not created. Ensure pool is created when running the app.');

			return new Promise<T>((resolve, reject) => {
				this.pool.query(query, params, (error, results) => {
					if (error) reject(error);
					else resolve(results);
				});
			});

		} catch (error) {
			console.error('[mysql.connector][execute][Error]: ', error);
			throw new Error('failed to execute MySQL query');
		}
	}

		/**
	 * This function retrieves a connection from the MySQL pool.
	 * 
	 * @returns {Promise<PoolConnection>} A Promise that resolves with the connection if successful,
	 *                                   or rejects with an error if there was a problem getting the connection.
	 */
	public getConnection = (): Promise<PoolConnection> => {
		return new Promise((resolve, reject) => {
				// This pool.getConnection function attempts to get a connection from the pool.
				this.pool.getConnection((err, connection) => {
						if (err) {
								// If there's an error (e.g., all connections in the pool are in use), the Promise is rejected with the error.
								reject(err);
						} else {
								// If a connection is successfully retrieved from the pool, the Promise is resolved with the connection.
								resolve(connection);
						}
				});
		});
	}

	// This function begins a new transaction on the provided connection.
	// It returns a Promise that resolves when the transaction is successfully started,
	// or rejects with an error if starting the transaction fails.
	public beginTransaction = (connection: PoolConnection): Promise<void> => {
    return new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
            if(err) reject(err);// If there's an error, reject the Promise.
            resolve(); // Otherwise, resolve the Promise.
        });
    });
	}
	// This function attempts to commit the current transaction on the provided connection.
	// It returns a Promise that resolves when the transaction is successfully committed,
	// or rejects with an error if the commit fails.
	public commitTransaction = (connection: PoolConnection): Promise<void> => {
		return new Promise((resolve, reject) => {
				connection.commit((err) => {
						if(err) reject(err);
						resolve();
				});
		});
	}
	// This function rolls back the current transaction on the provided connection.
	// It returns a Promise that resolves when the transaction is successfully rolled back,
	// or rejects with an error if the rollback fails.
	public rollbackTransaction = (connection: PoolConnection): Promise<void> => {
		return new Promise((resolve, reject) => {
				connection.rollback((err) => {
						if(err) reject(err);
						resolve();
				});
		});
	}
	// This function executes a SQL query within a transaction on the provided connection.
	// It returns a Promise that resolves with the results of the query when the query is 
	// successfully executed, or rejects with an error if the query execution fails.
	public executeTransaction = <T>(connection: PoolConnection, query: string, params: string[] | Object): Promise<T> => {
		return new Promise<T>((resolve, reject) => {
				connection.query(query, params, (error, results) => {
						if(error) reject(error);
						else resolve(results);
				});
		});
	}
}


const db = new MySqlConnector(config.mysql);

export default db;