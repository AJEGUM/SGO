import Redis from 'ioredis';

const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
  connectTimeout: 10000, // 10 segundos de espera
  family: 4,             // Forzar IPv4 para evitar el lío de localhost en Windows
  reconnectOnError: (err) => {
    const targetError = "READONLY";
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
});

// Este log es VITAL. Si no aparece al reiniciar el back, no estamos conectados.
redis.on('connect', () => {
  console.log('🚀 Redis: Conectado exitosamente desde Docker (IPv4)');
});

redis.on('error', (err) => {
  console.error('❌ Redis: Error detectado:', err.message);
});

export default redis;