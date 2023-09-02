import type { Client } from 'edgedb'
import { createClient } from 'edge/edgeql-js'

let client_instance: Client | undefined;

export function get_client() {
  if (client_instance) return client_instance
  return client_instance = createClient()
}

