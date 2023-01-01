import { createElement as vNode, useState, useEffect, useRef } from "../../../vendor/react.js";
import MyVis from "../lib/my-vis.mjs.js";
import {
  Tooltip,
  MessagePlugin,
  DialogPlugin,
} from "../../../vendor/tdesign.min.js";

export default function MyViewPanel(props) {

  const [elementId, set_elementId] = useState(props?.elementId??"diagram");

  const [alt, set_alt] = useState("");

  const myVis = new MyVis({
    config: {
      window: window,
      document: document,
      elementId: elementId,

      level_height: 70,
      base_height: 10,
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
      myVis.init();
      set_alt("");
    } else {
      set_alt("节点较多，请点击「重新绘制」手动加载");
    };
  }, []);

  // useEffect(async()=>{
  //   console.log("[myVis.data, myVis.config.elementId] changed");

  //   // console.log(myVis.config.elementId);
  //   // console.log('D3?.select?.(elementId)?.node?.():\n', D3?.select?.(elementId)?.node?.());

  //   const timeoutIdx = setTimeout(async()=>{
  //     // console.log('D3?.select?.(elementId)?.node?.():\n', D3?.select?.(elementId)?.node?.());
  //     console.log("😄");
  //     if (myVis.data!=null) {
  //       await myVis.init();
  //     };
  //   }, 3000);

  //   return async()=>{
  //     cleartimeout(timeoutIdx);
  //   };

  // }, [myVis.data, myVis.config.elementId]);

  const [theVis, set_theVis] = useState(myVis);

  const theSVG = useRef(null);



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
          id: elementId, className: "diagram",
          // onClick: ()=>{
          //   MessagePlugin.info('onClick');
          //   console.log("onClick");
          // },
          // ontick: ()=>{
          //   // MessagePlugin.info('ontick');
          //   console.log("ontick");
          //   myVis.resize();
          // },
          // onTick: ()=>{
          //   // MessagePlugin.info('onTick');
          //   console.log("onTick");
          //   myVis.resize();
          // },
          // onEnd: ()=>{
          //   MessagePlugin.info('onEnd');
          //   console.log("onEnd");
          // },
          // onDragStart: ()=>{
          //   MessagePlugin.info('onDragStart');
          //   console.log("onDragStart");
          // },
          // onDrag: ()=>{
          //   // MessagePlugin.info('onDrag');
          //   // console.log("onDrag");
          // },
          // onDragEnd: ()=>{
          //   MessagePlugin.info('onDragEnd');
          //   console.log("onDragEnd");
          // },
          // onResize: ()=>{
          //   MessagePlugin.info('onResize');
          //   // console.log("onResize");
          // },
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
          await myVis.init();
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
        content: "将此图形以SVG格式导出保存",
      }, vNode('button', {
        type: "button",
        className: [
          "btn btn-sm",
          "btn-outline-secondary",
        ].join(" "),
        onClick: async()=>{
          MessagePlugin.info("功能待开发");
          if (theVis?.svg?.node?.()==null) {
            MessagePlugin.info("请先绘制图形");
            return;
          };
          console.log(elementId);
          console.log(theVis?.svg?.node?.()?.outerHTML);
        },
      }, "导出SVG")),
      vNode(Tooltip, {
        content: "查看json格式的数据内容",
      }, vNode('button', {
        type: "button",
        className: [
          "btn btn-sm",
          "btn-outline-secondary",
        ].join(" "),
        onClick: async()=>{
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
                  value: JSON.stringify(props?.data),
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
        },
      }, "查看JSON")),
      // vNode(Tooltip, {
      //   content: "将此图形以PNG格式导出保存",
      // }, vNode('button', {
      //   type: "button",
      //   className: [
      //     "btn btn-sm",
      //     "btn-outline-secondary",
      //   ].join(" "),
      //   onClick: async()=>{
      //     MessagePlugin.info("功能待开发");
      //     if (theVis?.svg?.node?.()==null) {
      //       MessagePlugin.info("请先绘制图形");
      //       return;
      //     };
      //   },
      // }, "导出PNG")),
    ]),
  ]);
};
