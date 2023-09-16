import "./style.css";
import { tableFromArrays } from "apache-arrow";
import * as duckdb from "@duckdb/duckdb-wasm";
import duckdb_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import mvp_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import duckdb_wasm_eh from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import eh_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: duckdb_wasm,
    mainWorker: mvp_worker,
  },
  eh: {
    mainModule: duckdb_wasm_eh,
    mainWorker: eh_worker,
  },
};

// Select a bundle based on browser checks
const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
// Instantiate the asynchronus version of DuckDB-wasm
const worker = new Worker(bundle.mainWorker!);
const logger = new duckdb.ConsoleLogger();
const db = new duckdb.AsyncDuckDB(logger, worker);
await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

// Connect to a database
const c = await db.connect();

const arrowTable = tableFromArrays({
  id: [1, 2, 3],
  name: ["John", "Jane", "Jack"],
  age: [20, 21, 22],
});

console.log(
  `Null count: ${arrowTable.nullCount} rows: ${arrowTable.numRows} cols: ${arrowTable.numCols}`
);

await c.insertArrowTable(arrowTable, {
  name: "arrow_table",
  create: true,
  schema: "main",
});

const arrowResult = await c.query("SELECT * FROM main.arrow_table");

// Result to array
const result = arrowResult.toArray().map((row) => row.toJSON());
console.log(result);

const query_remote_parquet = await c.query(
  `
  SELECT n_name, count(*)
  FROM 'https://shell.duckdb.org/data/tpch/0_01/parquet/customer.parquet',
       'https://shell.duckdb.org/data/tpch/0_01/parquet/nation.parquet'
  WHERE c_nationkey = n_nationkey GROUP BY n_name;
  `
);

const fields = query_remote_parquet.schema.fields.map((f) => f.name);
console.log(fields);

// Close the connection
await c.close();

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    Hello, World!
  </div>
`;
