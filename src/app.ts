import fastify from 'fastify';
import AltairFastify from 'altair-fastify-plugin';
import mercurius from 'mercurius';
import schema from './graphql';
import buildContext from './graphql/context';
import databasePlugin from './plugins/database';

const app = fastify({ logger: true });

app.register(mercurius, {
  schema,
  context: buildContext,
});

app.register(AltairFastify, {
  path: '/altair',
  endpointURL: '/graphql',
});

app.register(databasePlugin);

export default app;