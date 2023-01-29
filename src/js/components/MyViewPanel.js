import { createElement as vNode, useState, useEffect, useRef } from "../../../vendor/react.js";
import MyVis from "../lib/my-vis.mjs.js";
import {
  Tooltip,
  MessagePlugin,
  DialogPlugin,
} from "../../../vendor/tdesign.min.js";
import { save as saveIt, saveLines, saveText, saveBlob } from "../utils/save.js";


// 将 SVG 转换为 PNG
function svgToPng(svgElement, width, height, callback=((blob)=>{console.log("blob:\n", blob)})) {
  // 创建一个 canvas 元素
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  // 将 SVG 内容绘制到 canvas 中
  var ctx = canvas.getContext('2d');
  var data = (new XMLSerializer()).serializeToString(svgElement);
  var DOMURL = window.URL || window.webkitURL || window;
  var img = new Image();
  var svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
  var url = DOMURL.createObjectURL(svgBlob);
  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    DOMURL.revokeObjectURL(url);
  };
  img.src = url;

  return canvas.toBlob(callback, "image/png");

  // // 使用 canvas.toDataURL() 方法生成 PNG 图像的 data URL
  // var dataUrl = canvas.toDataURL('image/png');
  // console.log(dataUrl);
  // var data = dataUrl.split(',')[1];
  // console.log(data);
  // return window.atob(data);
};




export default function MyViewPanel(props) {

  const myVisEventHandlerInfoList = [
    {name: "end", fn: (event)=>{
      // console.log("end");
      // console.log(event);
    }},
    // {name: "resize", fn: (event)=>{
    //   console.log("resize");
    //   console.log(event);
    // }},
    // {name: "tick", fn: (event)=>{
    //   console.log("tick");
    //   console.log(event);
    // }},
    // {name: "drag", fn: (event)=>{
    //   console.log("drag");
    //   console.log(event);
    // }},
    // {name: "drag-move", fn: (event)=>{
    //   console.log("drag-move");
    //   console.log(event);
    // }},
    {name: "drag-start", fn: (event)=>{
      // console.log("drag-start");
      // console.log(event);
    }},
    {name: "drag-end", fn: (event)=>{
      // console.log("drag-end");
      // console.log(event);
    }},
  ];
  const myVisWrapperRef = useRef(null);
  useEffect(()=>{
    const myVisWrapper = myVisWrapperRef.current;
    for (const info of myVisEventHandlerInfoList) {
      myVisWrapper.addEventListener(info.name, info.fn);
    };
    return ()=>{
      for (const info of myVisEventHandlerInfoList) {
        myVisWrapper.removeEventListener(info.name, info.fn);
      };
    };
  }, []);

  const [elementId, set_elementId] = useState(props?.elementId??"diagram");

  const [alt, set_alt] = useState("");

  const myVis = new MyVis({
    config: {
      window: window,
      document: document,
      elementId: elementId,

      level_height: 70,
      base_height: 10,

      alphaTarget: 0,
      alphaDecay: 0.05, // 0.1,  // 力道衰减率
      velocityDecay: 0.3, // 0.3,  // 速度衰减率 越大结束越快 // 每个 tick 速度 = 速度*(1-速度衰减率)
    },
    data: props?.data??{
      text: "",
      entities: [],
      relations: [],
      attributes: [
        // Format: [${ID}, ${TYPE}, ${TARGET}],
      ],
    },
  });

  useEffect(()=>{
    if (
      true
      &&(myVis?.data?.tokens?.length??0)<20
      &&(myVis?.data?.spans?.length??0)<20
      &&(myVis?.data?.nodes?.length??0)<40
    ) {
      myVis.clean();
      myVis.init(true);
      set_alt("");
    } else {
      set_alt("节点较多，请点击「重新绘制」手动加载");
    };
  }, []);

  const [theVis, set_theVis] = useState(myVis);

  const theSVG = useRef(null);

  const showJson = async(flag="data", indent=undefined)=>{
    const myDialog = DialogPlugin({
      width: "80%",
      header: "查看JSON",
      body: vNode('div', {
        className: "",
      }, [
        vNode('div', {}, [
          vNode('textarea', {
            className: [
              "form-control",
              // "form-control-sm",
            ].join(" "),
            // value: JSON.stringify(props?.data, null, 2),
            // value: JSON.stringify(props?.['sourceData']),
            value: JSON.stringify(props?.[flag], null, indent),
          }),
        ]),
      ]),
      cancelBtn: false,
      onConfirm: ({ event, trigger }) => {
        myDialog.hide();
      },
      onClose: ({ event, trigger }) => {
        myDialog.hide();
      },
    });
  };



  return vNode('div', {
    className: [
      "my-2 p-2",
      "bg-white",
      "border border-1 rounded",
      "overflow-auto",
    ].join(" ")
  }, [
    vNode('div', {className: "diagram-wrap my-2"}, [
      vNode('div', {}, [
        vNode('diagram', {
          ref: myVisWrapperRef,
          id: elementId, className: "diagram",
        }),
        vNode('div', {
          className: [
            "text-muted text-center",
            alt?.length ? "--d-none" : "d-none",
          ].join(" "),
        }, alt),
      ]),
    ]),
    vNode('div', {className: "hstack gap-1 justify-content-center"}, [
      vNode(Tooltip, {
        content: "重新绘制整个图形",
      }, vNode('button', {
        type: "button",
        className: [
          "btn btn-sm",
          "btn-outline-secondary",
        ].join(" "),
        onClick: async()=>{
          await myVis.clean();
          await myVis.init(true);
          set_alt("");
          // console.log(myVis);
          // console.log(myVis?.svg_g_root);
          set_theVis(myVis);
        },
      }, "重新绘制")),
      vNode(Tooltip, {
        content: "在图中拖拽或缩放之后，重新调整到合适的布局",
      }, vNode('button', {
        type: "button",
        className: [
          "btn btn-sm",
          "btn-outline-secondary",
        ].join(" "),
        onClick: ()=>{
          // console.log(myVis);
          // console.log(myVis?.svg_g_root);
          // console.log(theVis);
          // console.log(theVis?.svg_g_root);
          theVis.resize();
        },
      }, "调整布局")),
      vNode(Tooltip, {
        content: "查看针对可视化工具处理之后的json格式数据",
      }, vNode('button', {
        type: "button",
        className: [
          "btn btn-sm",
          "btn-outline-secondary",
        ].join(" "),
        onClick: async()=>{
          showJson('data');
        },
      }, "查看JSON")),
      vNode(Tooltip, {
        content: "查看原始的json格式数据内容",
      }, vNode('button', {
        type: "button",
        className: [
          "btn btn-sm",
          "btn-outline-secondary",
        ].join(" "),
        onClick: async()=>{
          showJson('sourceData');
        },
      }, "查看原始JSON")),
      vNode(Tooltip, {
        content: "将此图形以SVG格式导出保存",
      }, vNode('button', {
        type: "button",
        className: [
          "btn btn-sm",
          "btn-outline-secondary",
        ].join(" "),
        onClick: async()=>{
          // MessagePlugin.info("功能待开发");
          if (theVis?.svg?.node?.()==null) {
            MessagePlugin.info("请先绘制图形");
            return;
          };
          saveText(theVis?.svg?.node?.()?.outerHTML, `${elementId}.svg`);
        },
      }, "导出SVG")),
      true ? null : vNode(Tooltip, {
        content: "将此图形以PNG格式导出保存",
      }, vNode('button', {
        type: "button",
        className: [
          "btn btn-sm",
          "btn-outline-secondary",
        ].join(" "),
        onClick: async()=>{
          MessagePlugin.info("功能待开发");
          return;
          // if (theVis?.svg?.node?.()==null) {
          //   MessagePlugin.info("请先绘制图形");
          //   return;
          // };
          // svgToPng(theVis?.svg?.node?.(), theVis?.svg?.attr("width"), theVis?.svg?.attr("height"), (blob)=>{
          //   saveBlob(blob, `${elementId}.png`);
          //   console.log("png blob\n", blob);
          // });
        },
      }, "导出PNG")),
    ]),
  ]);
};
