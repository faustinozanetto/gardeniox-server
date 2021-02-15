const type = process.env.TYPEORM_TYPE || 'postgres';

module.exports = {
  type,
  url: process.env.DATABASE_URL,
  entities: [
    process.env.NODE_ENV === 'test'
      ? 'src/entities/**/*.entity.ts'
      : 'dist/entities/**/*.entity.js',
  ],
  synchronize: true,
};
