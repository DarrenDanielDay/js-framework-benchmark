import { appendChild, select } from "hyplate/core";
import { For } from "hyplate/directive";
import { query, source } from "hyplate/store";
import { FunctionalComponent, Source } from "hyplate/types";
//#region common
const random = (max: number) => Math.round(Math.random() * 1000) % max;

const A = [
  "pretty",
  "large",
  "big",
  "small",
  "tall",
  "short",
  "long",
  "handsome",
  "plain",
  "quaint",
  "clean",
  "elegant",
  "easy",
  "angry",
  "crazy",
  "helpful",
  "mushy",
  "odd",
  "unsightly",
  "adorable",
  "important",
  "inexpensive",
  "cheap",
  "expensive",
  "fancy",
];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = [
  "table",
  "chair",
  "house",
  "bbq",
  "desk",
  "car",
  "pony",
  "cookie",
  "sandwich",
  "burger",
  "pizza",
  "mouse",
  "keyboard",
];
let nextId = 1;
interface Item {
  id: number;
  label: Source<string>;
  selected: Source<boolean>;
}
const buildData = (count: number) => {
  const data: Item[] = new Array(count);

  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: source(`${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`),
      selected: source(false),
    };
  }

  return data;
};
//#endregion

const Button: FunctionalComponent<{ id: string; title: string; cb: () => void }> = ({ id, cb, title }) => {
  return (
    <div class="col-sm-6 smallpad">
      <button type="button" class="btn btn-primary btn-block" id={id} onClick={cb}>
        {title}
      </button>
    </div>
  );
};

const App: FunctionalComponent = () => {
  const data = source<Item[]>([]);
  let lastSelected: Item | null = null;
  const run = () => {
    data.set([]);
    data.set(buildData(1000));
    lastSelected = null;
  };
  const runLots = () => {
    data.set([]);
    data.set(buildData(10000));
    lastSelected = null;
  };
  const add = () => {
    data.set(data.val.concat(buildData(1000)));
  };
  const update = () => {
    const list = data.val;
    for (let i = 0; i < list.length; i+= 10) {
      const item = list[i]!;
      item.label.set(item.label.val + " !!!");
    }
  };
  const clear = () => {
    data.set([]);
    lastSelected = null;
  };
  const swapRows = () => {
    const list = data.val.slice();
    if (list.length > 998) {
      const d1 = list[1]!;
      const d998 = list[998]!;
      list[1] = d998;
      list[998] = d1;
      data.set(list);
    }
  };
  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Hyplate JSX keyed</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <Button id="run" title="Create 1,000 rows" cb={run} />
              <Button id="runlots" title="Create 10,000 rows" cb={runLots} />
              <Button id="add" title="Append 1,000 rows" cb={add} />
              <Button id="update" title="Update every 10th row" cb={update} />
              <Button id="clear" title="Clear" cb={clear} />
              <Button id="swaprows" title="Swap Rows" cb={swapRows} />
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody>
          <For of={data}>
            {(item) => (
              <tr class={query(() => (item.selected.val ? "danger" : ""))}>
                <td class="col-md-1">{item.id}</td>
                <td class="col-md-4">
                  <a
                    onClick={() => {
                      // Select
                      lastSelected?.selected.set(false);
                      item.selected.set(true);
                      lastSelected = item;
                    }}
                  >
                    {item.label}
                  </a>
                </td>
                <td class="col-md-1">
                  <a
                    onClick={() => {
                      // Remove
                      if (lastSelected === item) {
                        lastSelected = null;
                      }
                      data.set(data.val.filter((inList) => item !== inList));
                    }}
                  >
                    <span class="glyphicon glyphicon-remove" aria-hidden="true" />
                  </a>
                </td>
                <td class="col-md-6" />
              </tr>
            )}
          </For>
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
};

(<App></App>)(appendChild(select("div#main")));
