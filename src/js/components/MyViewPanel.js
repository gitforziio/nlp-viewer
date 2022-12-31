import { createElement as vNode, useState, useEffect } from "../../../vendor/react.js";
import MyVis from "../lib/my-vis.mjs.js";
import {
  MessagePlugin,
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
        alt?.length ? vNode('div', {
          className: "text-muted text-center",
        }, alt) : null,
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
        })
      ]),
    ]),
    vNode('div', {className: "hstack gap-1 justify-content-center"}, [
      vNode('button', {
        type: "button",
        className: [
          "btn btn-sm",
          "btn-outline-secondary",
        ].join(" "),
        onClick: ()=>{myVis.resize();},
      }, "调整布局"),
      vNode('button', {
        type: "button",
        className: [
          "btn btn-sm",
          "btn-outline-secondary",
        ].join(" "),
        onClick: async()=>{
          await myVis.clean();
          await myVis.init();
          set_alt("");
        },
      }, "重新绘制"),
    ]),
  ]);
};
