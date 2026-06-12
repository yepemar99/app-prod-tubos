import odbc from 'odbc';
import { DB_CONFIG, DB_LOCAL_CONFIG } from '../utils/constants';

class Database {
  constructor() {
    if (Database.instance) return Database.instance;
    this.remote = null;
    this.active = null;
    this.status = { target: 'unknown', connected: false };

    Database.instance = this;
  }

  _setActive(connection, target) {
    this.active = connection;
    this.status = {
      target,
      connected: true,
    };
    console.log('⚡ DB ACTIVE =', this.status);
  }

  async _connectWithConfig(config) {
    return await odbc.connect(
      `Driver={ODBC Driver 17 for SQL Server};
       Server=${config.remote.server};
       Database=${config.remote.database};
       Uid=${config.remote.user};
       Pwd=${config.remote.password};
       TrustServerCertificate=Yes;
       LoginTimeout=2;`,
    );
  }

  // -------------------------------
  // CONECTAR A SQL SERVER REMOTO
  // -------------------------------
  async connectRemote() {
    try {
      console.log('Intentando conectar a SQL Server remoto...');

      this.remote = await this._connectWithConfig(DB_CONFIG);

      console.log('✔ Conectado a SQL Server remoto');
      this._setActive(this.remote, 'remote');
      return this.remote;
    } catch (err) {
      console.error('❌ No se pudo conectar al remoto:', err);
      this.remote = null;
      throw err;
    }
  }

  async connectLocal() {
    try {
      console.log('Intentando conectar a SQL Server local...');

      this.active = await this._connectWithConfig(DB_LOCAL_CONFIG);

      console.log('✔ Conectado a SQL Server local');
      this._setActive(this.active, 'local');
      return this.active;
    } catch (err) {
      console.error('❌ No se pudo conectar a la local:', err);
      this.active = null;
      throw new Error('No se pudo conectar al SQL Server local.');
    }
  }

  async connect() {
    console.log('Inicializando conexión a BD remota...');
    try {
      return await this.connectRemote();
    } catch (remoteError) {
      console.warn('⚠️ Reintentando con la base local...');
      try {
        return await this.connectLocal();
      } catch (localError) {
        throw new Error(
          `No se pudo conectar ni a la base remota ni a la local. Remota: ${remoteError.message}; Local: ${localError.message}`,
        );
      }
    }
  }

  getConnection() {
    if (!this.active) throw new Error('Base de datos no conectada.');
    return this.active;
  }
}

const database = new Database();
export default database;
