import { createElement as vNode, Fragment, useState } from "../../../../vendor/react.js";
import storage from "../../utils/store.js";
// import ReactRouterDom from "../../../../vendor/react-router-dom.js";
import MyViewPanelGroup from "../../components/MyViewPanelGroup.js";
import {
  Layout,
  Menu,
  Row,
  Col,
  Button,
  Space,
  Upload,
  MessagePlugin,
} from "../../../../vendor/tdesign.min.js";


const backendNLP = async (text, href) => {
  const data = { text: text, };

  const result = await fetch(`${href}/api/nlp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(json_data => {
    // console.log('Success:', json_data);
    return json_data;
  })
  .catch((error) => {
    // console.error('Error:', error);
    return { error: error, };
  });

  return result;
};


export default function RealTimeDemo() {

  const [backend_href, set_backend_href] = useState(storage?.getItem?.("backend_href")??"");
  const [is_checking, set_is_checking] = useState(false);
  const [real_time_demo_text, set_real_time_demo_text] = useState(storage?.getItem?.("real_time_demo_text")??"");
  const [is_processing, set_is_processing] = useState(false);

  const [nlp_data, set_nlp_data] = useState(null);

  return vNode('div', {
    className: ["container"].join(" "),
  }, [

    vNode('div', {
      className: ["row", "my-2", "d-flex", "align-items-center"].join(" "),
    }, [
      vNode('div', {
        className: ["col", "col-12", "col-lg-2", "col-sm-3"].join(" "),
      }, [
        vNode('label', {
          className: "--form-label",
        }, "后端地址")
      ]),
      vNode('div', {
        className: ["col", "col-12", "col-lg-10", "col-sm-9"].join(" "),
      }, [
        vNode('div', {
          className: ["input-group"].join(" "),
        }, [
          vNode('input', {
            className: ["form-control", "form-control-sm"].join(" "),
            type: "text",
            'aria-label': "后端地址",
            value: backend_href,
            onChange: (event)=>{
              const new_backend_href = event?.target?.value ?? "";
              set_backend_href(new_backend_href);
              storage.setItem("backend_href", new_backend_href);
            },
          }),
          vNode('button', {
            className: ["btn", "btn-outline-secondary"].join(" "),
            disabled: is_checking,
            type: "button",
            onClick: async(event)=>{
              console.log(event);
              set_is_checking(true);
              const result = await backendNLP("测试", backend_href);
              if (result?.error) {
                MessagePlugin.error(`发生错误：${result?.error}`);
                console.log(result);
              } else {
                MessagePlugin.success(`没问题`);
                console.log(result);
              };
              set_is_checking(false);
            },
          }, is_checking ? "稍等" : "测试"),
        ]),
      ]),
    ]),



    vNode('div', {
      className: ["row", "my-2", "d-flex", "align-items-center"].join(" "),
    }, [
      vNode('div', {
        className: ["col", "col-12", "col-lg-2", "col-sm-3"].join(" "),
      }, [
        vNode('label', {
          className: "--form-label",
        }, "待分析文本")
      ]),
      vNode('div', {
        className: ["col", "col-12", "col-lg-10", "col-sm-9"].join(" "),
      }, [
        vNode('div', {
          className: ["vstack", "gap-2"].join(" "),
        }, [
          vNode('textarea', {
            className: [
              "form-control",
              // "form-control-sm",
            ].join(" "),
            'aria-label': "待分析文本",
            rows: 3,
            value: real_time_demo_text,
            onChange: (event)=>{
              const new_real_time_demo_text = event?.target?.value ?? "";
              set_real_time_demo_text(new_real_time_demo_text);
              storage.setItem("real_time_demo_text", new_real_time_demo_text);
            },
          }),
          vNode('button', {
            className: ["btn", "btn-outline-secondary"].join(" "),
            disabled: is_processing,
            type: "button",
            onClick: async(event)=>{
              console.log(event);
              set_is_processing(true);
              const result = await backendNLP(real_time_demo_text, backend_href);
              if (result?.error) {
                MessagePlugin.error(`发生错误：${result?.error}`);
                console.log(result);
              } else {
                MessagePlugin.success(`成功`);
                console.log(result);
                set_nlp_data(result?.data);
              };
              set_is_processing(false);
            },
          }, is_processing ? "稍等" : "分析"),
        ])
      ]),
    ]),



    nlp_data==null ? null :
    vNode('div', {
      className: ["row", "my-3", "d-flex", "align-items-center"].join(" "),
    }, [
      vNode('div', {
        className: ["col"].join(" "),
      }, [
        vNode(MyViewPanelGroup, {
          data: nlp_data,
          key: nlp_data?.text,
        }),
      ])
    ]),



  ]);
}