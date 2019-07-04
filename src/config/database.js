module.exports = {
  dialect: 'postgres',
  port: 5423,
  host: 'localhost',
  username: 'meetapp',
  password: 'root',
  database: 'gobarber',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
