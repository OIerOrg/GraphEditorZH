import { parseGraphInputEdges } from "./parseGraphInput";
import { parseGraphInputParentChild } from "./parseGraphInput";
import { useEffect, useState } from "react";
import { InputFormat, ParsedGraph } from "../types";
import { Graph } from "../types";
import { sortNodes } from "./utils";

interface Props {
  graphEdges: Graph;
  setGraphEdges: React.Dispatch<React.SetStateAction<Graph>>;
  graphParChild: Graph;
  setGraphParChild: React.Dispatch<React.SetStateAction<Graph>>;
  inputFormat: InputFormat;
  setInputFormat: React.Dispatch<React.SetStateAction<InputFormat>>;
  directed: boolean;
  setDirected: React.Dispatch<React.SetStateAction<boolean>>;
}

export function GraphInput({
  graphEdges,
  setGraphEdges,
  graphParChild,
  setGraphParChild,
  inputFormat,
  setInputFormat,
  directed,
  setDirected,
}: Props) {
  const [inputStatus, setInputStatus] = useState<boolean>(true);

  // 生成随机图函数
  const generateRandomGraph = () => {
    const n = 10; // 节点数
    const m = Math.floor(Math.random() * 20) + 1; // 随机生成边数 m <= 20
    let edges = [];
    for (let i = 0; i < m; i++) {
      const u = Math.floor(Math.random() * n) + 1;
      const v = Math.floor(Math.random() * n) + 1;
      if (u !== v) {
        edges.push(`${u} ${v}`);
      }
    }
    return edges.join("\n");
  };

  const processGraphInput = () => {
    let parsedGraph: ParsedGraph;

    let roots = "";

    if (!directed) {
      roots =
        inputFormat === "edges"
          ? (
              document.getElementById(
                "graphInputRootsEdges",
              ) as HTMLTextAreaElement
            ).value
          : (
              document.getElementById(
                "graphInputRootsParChild",
              ) as HTMLTextAreaElement
            ).value;
    }

    if (inputFormat === "edges") {
      parsedGraph = parseGraphInputEdges(
        roots,
        (document.getElementById("graphInputEdges") as HTMLTextAreaElement)
          .value,
        (document.getElementById("graphInputNodeLabels") as HTMLTextAreaElement)
          .value,
      );
      if (parsedGraph.status === "BAD") {
        setInputStatus(false);
      } else {
        setInputStatus(true);
        setGraphEdges(parsedGraph.graph!);
      }
    } else {
      parsedGraph = parseGraphInputParentChild(
        roots,
        (document.getElementById("graphInputParent") as HTMLTextAreaElement)
          .value,
        (document.getElementById("graphInputChild") as HTMLTextAreaElement)
          .value,
        (document.getElementById("graphInputEdgeLabels") as HTMLTextAreaElement)
          .value,
        (document.getElementById("graphInputNodeLabels") as HTMLTextAreaElement)
          .value,
      );
      if (parsedGraph.status === "BAD") {
        setInputStatus(false);
      } else {
        setInputStatus(true);
        setGraphParChild(parsedGraph.graph!);
      }
    }
  };

  const processNodeLabels = () => {
    const currentNodes = (
      document.getElementById("graphInputCurrentNodes") as HTMLTextAreaElement
    ).value
      .trim()
      .split(/\s+/)
      .filter((u) => u.length);

    const nodeLabels = (
      document.getElementById("graphInputNodeLabels") as HTMLTextAreaElement
    ).value
      .trim()
      .split(/\s+/)
      .filter((u) => u.length);

    const len = Math.min(currentNodes.length, nodeLabels.length);

    let mp = new Map<string, string>();

    for (let i = 0; i < len; i++) {
      if (nodeLabels[i] !== "_") {
        mp.set(currentNodes[i], nodeLabels[i]);
      }
    }

    if (inputFormat === "edges") {
      setGraphEdges({ ...graphEdges, nodeLabels: mp });
    } else {
      setGraphParChild({ ...graphParChild, nodeLabels: mp });
    }
  };

  const handleTextAreaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Escape") {
      e.currentTarget.blur();
    }
  };

  useEffect(() => {
    processGraphInput();
  }, [inputFormat]);

  return (
    <>
      <div
        className="font-jetbrains flex flex-col border-2 rounded-lg bg-block
          shadow-shadow shadow border-border sm:ml-1/16 sm:mt-1/8 sm:mr-1/16
          lg:m-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:w-1/4
          hover:border-border-hover lg:left-1/24 xl:left-5/200 xl:w-1/5 p-3
          space-y-3 z-10"
      >
        <h3 className="font-bold text-lg">图形数据</h3>

        <br />

        <h4 className="text-base font-semibold">当前已有节点</h4>
        <textarea
          wrap="off"
          rows={1}
          name="graphInputCurrentNodes"
          id="graphInputCurrentNodes"
          onChange={processNodeLabels}
          value={
            inputFormat === "edges"
              ? sortNodes(graphEdges.nodes).join(" ")
              : sortNodes(graphParChild.nodes).join(" ")
          }
          className="bg-ovr font-semibold font-jetbrains resize-none border-2
            rounded-md px-2 py-1 border-single focus:outline-none text-lg
            text-current-nodes border-border w-auto no-scrollbar"
        ></textarea>

        {/* 其他代码省略 */}

        <div className="flex justify-between">
          <button
            className="bg-clear-normal hover:bg-clear-hover
              active:bg-clear-active inline rounded-md px-2 py-1"
            onClick={() => {
              if (inputFormat === "edges") {
                (
                  document.getElementById(
                    "graphInputEdges",
                  ) as HTMLTextAreaElement
                ).value = generateRandomGraph();
              } else {
                (
                  document.getElementById(
                    "graphInputParent",
                  ) as HTMLTextAreaElement
                ).value = generateRandomGraph();
              }
              processGraphInput();
            }}
          >
            生成随机图
          </button>
        </div>
      </div>
    </>
  );
}
