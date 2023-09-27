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

const fieldTypes = query_remote_parquet.schema.fields.map((f) => f.type);
console.log(fieldTypes);

const fieldTypesNames = query_remote_parquet.schema.fields.map((f) =>
  f.type.toString()
);
console.log(fieldTypesNames);

const firstRow = query_remote_parquet.get(0)?.toString();
console.log(firstRow?.toString());

const lastRow = query_remote_parquet.get(query_remote_parquet.numRows - 1);
console.log(lastRow?.toString());

const result_recursive_cte = await c.query(
  `
  WITH RECURSIVE factorial_cte(n, factorial) AS (
    SELECT 1, 1   -- Anchor member: initialize the initial values
    UNION ALL
    SELECT n + 1, (n + 1) * factorial
    FROM factorial_cte
    WHERE n < 5   -- Recursive member: perform the recursive calculation until the condition is met
  )
  SELECT factorial
  FROM factorial_cte
  WHERE n = 5;
  `
);

console.log(result_recursive_cte.get(0)?.toString());

const result_recursive_cte_hierarchy = await c.query(
  `
  CREATE TABLE files (
    file_id INT PRIMARY KEY,
    name VARCHAR(255),
    parent_id INT
  );

  -- Insert sample data into the "files" table
  INSERT INTO files (file_id, name, parent_id) VALUES
    (1, 'root_folder', NULL),
    (2, 'folder1', 1),
    (3, 'folder2', 1),
    (4, 'file1.txt', 2),
    (5, 'file2.txt', 2),
    (6, 'subfolder1', 3),
    (7, 'file3.txt', 6);

  WITH RECURSIVE file_paths AS (
    SELECT file_id, name, parent_id, name as path
    FROM files
    WHERE parent_id IS NULL   -- Anchor member: select the root files
    UNION ALL
    SELECT f.file_id, f.name, f.parent_id, CONCAT(fp.path, '/', f.name)
    FROM files f
    JOIN file_paths fp ON f.parent_id = fp.file_id   -- Recursive member: join with previous level
  )
  SELECT file_id, path
  FROM file_paths;
  `
);

console.log(
  result_recursive_cte_hierarchy.toArray().map((row) => row.toJSON())
);

// Close the connection
await c.close();

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    Hello, World!
  </div>
`;
