import './env';
import { createDefaultRegistry } from '../../../src/core/capabilities/defaultRegistry';

/** One registry per server process; capabilities are stateless, so sharing is safe. */
export const registry = createDefaultRegistry();
