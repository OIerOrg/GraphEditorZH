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

  // 生成随机图的函数
  const generateRandomGraph = () => {
    const numNodes = 5; // 随机图的节点数
    const numEdges = 4; // 随机图的边数

    const nodes = Array.from({ length: numNodes }, (_, i) => i + 1);
    const edges = Array.from({ length: numEdges }, () => {
      const u = Math.floor(Math.random() * numNodes) + 1;
      const v = Math.floor(Math.random() * numNodes) + 1;
      return `${u} ${v}`;
    }).join("\n");

    const nodeLabels = nodes.map(() => "_").join(" ");

    if (inputFormat === "edges") {
      (document.getElementById("graphInputEdges") as HTMLTextAreaElement).value = edges;
      (document.getElementById("graphInputNodeLabels") as HTMLTextAreaElement).value = nodeLabels;
      processGraphInput();
    } else {
      const parents = nodes.map(() => Math.floor(Math.random() * numNodes) + 1).join(" ");
      const children = nodes.map(() => Math.floor(Math.random() * numNodes) + 1).join(" ");
      const edgeLabels = nodes.map(() => "_").join(" ");

      (document.getElementById("graphInputParent") as HTMLTextAreaElement).value = parents;
      (document.getElementById("graphInputChild") as HTMLTextAreaElement).value = children;
      (document.getElementById("graphInputEdgeLabels") as HTMLTextAreaElement).value = edgeLabels;
      (document.getElementById("graphInputNodeLabels") as HTMLTextAreaElement).value = nodeLabels;
      processGraphInput();
    }
  };

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
          readOnly
          className="bg-ovr font-semibold font-jetbrains resize-none border-2
            rounded-md px-2 py-1 border-single focus:outline-none text-lg
            text-current-nodes border-border w-auto no-scrollbar"
        ></textarea>

        <h4 className="text-base font-semibold">节点标签</h4>
        <textarea
          wrap="off"
          name="graphInputNodeLabels"
          id="graphInputNodeLabels"
          rows={1}
          onChange={processNodeLabels}
          onKeyDown={handleTextAreaKeyDown}
          placeholder="提示：'_' 代表空白标签"
          className="bg-ovr font-semibold font-jetbrains resize-none border-2
            rounded-md px-2 py-1 border-single focus:outline-none text-lg
            border-border focus:border-border-active placeholder-placeholder
            placeholder:italic w-auto no-scrollbar"
        ></textarea>

        <br />

        <div className="flex font-light text-sm justify-between">
          <span>
            <span>
              {inputFormat === "edges" ? (
                <span className="text-selected p-0 hover:cursor-pointer">
                  边
                </span>
              ) : (
                <span
                  className="p-0 hover:cursor-pointer"
                  onClick={() => {
                    setInputFormat("edges");
                    let checkbox = document.getElementById(
                      "inputFormatCheckbox",
                    ) as HTMLInputElement;
                    checkbox.checked = false;
                  }}
                >
                  边模式
                </span>
              )}
            </span>
            <span> | </span>
            <span>
              {inputFormat === "parentChild" ? (
                <span className="text-selected p-0 hover:cursor-pointer">
                  父亲 模式
                </span>
              ) : (
                <span
                  className="p-0 hover:cursor-pointer"
                  onClick={() => {
                    setInputFormat("parentChild");
                    let checkbox = document.getElementById(
                      "inputFormatCheckbox",
                    ) as HTMLInputElement;
                    checkbox.checked = true;
                  }}
                >
                  父亲 模式
                </span>
              )}
            </span>
          </span>

          <button
            onClick={generateRandomGraph}
            className="bg-blue-500 text-white rounded-md px-2 py-1 hover:bg-blue-600"
          >
            生成随机图
          </button>
        </div>
      </div>
    </>
  );
}
