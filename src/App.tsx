import { useState, useEffect, useReducer } from "react"; // 添加 useEffect
import { GraphInput } from "./components/GraphInput"; // 确保正确导入 GraphInput
import { GraphCanvas } from "./components/GraphCanvas";
import { GraphSettings } from "./components/GraphSettings";
import { InputFormat, Settings, Graph } from "./types"; // 确保正确导入类型

// 定义 GraphReducer 的 action 类型
interface GraphAction {
  type: string;
  payload: Graph;
}

// 定义 SettingsReducer 的 action 类型
interface SettingsAction {
  type: string;
  setting: keyof Settings;
  value: any; // 根据 setting 的不同，value 可以是 number, string, boolean 等
}

const initialGraph: Graph = {
  nodes: new Array<string>(),
  adj: new Map<string, string[]>(),
  rev: new Map<string, string[]>(),
  edges: new Array<string>(),
  edgeLabels: new Map<string, string>(),
  nodeLabels: new Map<string, string>(),
};

// 定义 GraphReducer
function graphReducer(state: { graphEdges: Graph; graphParChild: Graph }, action: GraphAction) {
  switch (action.type) {
    case "UPDATE_GRAPH_EDGES":
      return { ...state, graphEdges: action.payload };
    case "UPDATE_GRAPH_PAR_CHILD":
      return { ...state, graphParChild: action.payload };
    default:
      return state;
  }
}

const initialSettings: Settings = {
  labelOffset: 0,
  darkMode:
    localStorage.getItem("darkMode") !== null
      ? localStorage.getItem("darkMode") === "true"
      : false,
  nodeRadius:
    localStorage.getItem("nodeRadius") !== null
      ? Number.parseInt(localStorage.getItem("nodeRadius")!)
      : 16,
  nodeBorderWidthHalf:
    localStorage.getItem("nodeBorderWidthHalf") !== null
      ? Number.parseFloat(localStorage.getItem("nodeBorderWidthHalf")!)
      : 1,
  edgeLength:
    localStorage.getItem("edgeLength") !== null
      ? Number.parseFloat(localStorage.getItem("edgeLength")!)
      : 10,
  showComponents: false,
  showBridges: false,
  treeMode: false,
  lockMode: false,
};

// 定义 SettingsReducer
function settingsReducer(state: Settings, action: SettingsAction) {
  switch (action.type) {
    case "UPDATE_SETTING":
      return { ...state, [action.setting]: action.value };
    default:
      return state;
  }
}

function App() {
  // 使用 useReducer 替代 useState
  const [graphState, dispatchGraph] = useReducer(graphReducer, {
    graphEdges: initialGraph,
    graphParChild: initialGraph,
  });

  const [settingsState, dispatchSettings] = useReducer(
    settingsReducer,
    initialSettings
  );

  // 更新 graphEdges 的函数，指定参数类型
  const updateGraphEdges = (newEdges: Graph) => {
    dispatchGraph({ type: "UPDATE_GRAPH_EDGES", payload: newEdges });
  };

  // 更新 graphParChild 的函数，指定参数类型
  const updateGraphParChild = (newGraph: Graph) => {
    dispatchGraph({ type: "UPDATE_GRAPH_PAR_CHILD", payload: newGraph });
  };

  // 更新设置的函数，指定参数类型
  const updateSetting = (setting: keyof Settings, value: any) => {
    dispatchSettings({ type: "UPDATE_SETTING", setting, value });
  };

  // 保存设置到 LocalStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(settingsState.darkMode));
    localStorage.setItem("nodeRadius", settingsState.nodeRadius.toString());
    localStorage.setItem(
      "nodeBorderWidthHalf",
      settingsState.nodeBorderWidthHalf.toString()
    );
    localStorage.setItem("edgeLength", settingsState.edgeLength.toString());
  }, [settingsState]);

  return (
    <>
      <div
        className={
          settingsState.darkMode
            ? "dark bg-ovr text-text absolute w-full min-h-200 overflow-scroll"
            : "light bg-ovr text-text absolute w-full min-h-200 overflow-scroll"
        }
      >
        {/* Github Link */}
        <a
          className="font-jetbrains text-sm flex sm:top-2 lg:top-2 sm:right-2
            lg:right-2 absolute border-2 border-border rounded-lg px-2 py-1
            justify-between items-center hover:border-border-hover z-10"
          href="https://github.com/zjx-kimi/GraphEditor"
        >
          {settingsState.darkMode ? (
            <img
              width={18}
              src="github-mark/github-mark-white.svg"
              alt="Github Logo"
            />
          ) : (
            <img
              width={18}
              src="github-mark/github-mark.svg"
              alt="Github Logo"
            />
          )}
          <div className="ml-2">Github</div>
        </a>

        <GraphInput
          graphEdges={graphState.graphEdges}
          setGraphEdges={updateGraphEdges}
          graphParChild={graphState.graphParChild}
          setGraphParChild={updateGraphParChild}
          inputFormat={inputFormat}
          setInputFormat={setInputFormat}
          directed={directed}
          setDirected={setDirected}
        />

        <div className="relative z-0">
          <GraphCanvas
            graph={graphState.graphEdges}
            inputFormatToRender={"edges"}
            inputFormat={inputFormat}
            directed={directed}
            settings={settingsState}
          />

          <GraphCanvas
            graph={graphState.graphParChild}
            inputFormatToRender={"parentChild"}
            inputFormat={inputFormat}
            directed={directed}
            settings={settingsState}
          />
        </div>

        <GraphSettings
          directed={directed}
          settings={settingsState}
          setSettings={updateSetting}
        />
      </div>
    </>
  );
}

export default App;
