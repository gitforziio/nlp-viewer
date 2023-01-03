import { createElement as vNode, Fragment, useState, useMemo, useEffect } from "../../../../vendor/react.js";
// import ReactRouterDom from "../../../../vendor/react-router-dom.js";
import MyViewPanelGroup from "../../components/MyViewPanelGroup.js";
import {
  Layout,
  Menu,
  Row,
  Col,
  Space,
  Tooltip,
  Textarea,
  Button,
  Select,
  Checkbox,
  Input,
  TagInput,
  InputNumber,
  Upload,
  MessagePlugin,
  DialogPlugin,
} from "../../../../vendor/tdesign.min.js";
import Lodash from "../../../../vendor/lodash.mjs.js";
import storage from "../../utils/store.js";
import { save as saveIt, saveLines, saveText, saveBlob } from "../../utils/save.js";

export default function FileReaderDemoCollections(props) {

  return vNode('div', {}, [
    vNode('h5', {className: "h5"}, "已收集的条目"),
    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      vNode('span', {className: "fw-bold text-muted"}, "操作"),
      vNode(Tooltip, {
        content: "将已收集的条目作为文件加载，请注意：会取代已加载的文件",
      }, vNode(Button, {
        theme: "default", size: "small", onClick: async()=>{
          const newAppData = {
            current_file_info: {
              name: "已收集的条目",
            },
            data_list: props?.collectedMaterials,
          };
          if (props?.appData?.data_list?.length) {
            const myDialog = DialogPlugin({
              header: "作为文件加载",
              body: "请注意：这会取代已加载的文件，确定要加载吗？",
              onConfirm: ({ event, trigger }) => {
                props?.onAppDataChange?.(newAppData);
                myDialog.hide();
              },
              onClose: ({ event, trigger }) => {
                myDialog.hide();
              },
            });
          } else {
            props?.onAppDataChange?.(newAppData);
          };
        },
      }, "作为文件读取")),
    ]),
    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      vNode('span', {className: "fw-bold text-muted"}, "内容"),
    ]),
    vNode('div', {className: "my-1 vstack gap-2 flex-wrap"}, [
      (props?.collectedMaterials??[]).map((mtrl, mt_idx)=>vNode('div', {
        key: `${mt_idx}`,
        className: "my-1 hstack gap-2 flex-wrap",
      }, [
        vNode('span', {className: "fw-normal text-muted"}, mtrl?.head??"<无题>"),
        vNode(Button, {
          theme: "default", size: "small",
          onClick: ()=>{
            const myDialog = DialogPlugin({
              header: "删除收集的条目",
              body: "确定要删除吗？",
              onConfirm: ({ event, trigger }) => {
                const the_collectedMaterials = [...(props?.collectedMaterials??[])];
                the_collectedMaterials.splice(mt_idx, 1);
                props?.onSetCollectedMaterials?.(the_collectedMaterials);
                myDialog.hide();
              },
              onClose: ({ event, trigger }) => {
                myDialog.hide();
              },
            });
          },
        }, "删除"),
        mtrl?.nlp_outputs?.map((frag, fr_idx)=>vNode('span', {key: `${fr_idx}`, className: "fw-normal"}, frag?.text??"<无内容>")),
      ])),
    ]),


    vNode('h5', {className: "h5"}, "已收集的片段"),
    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      vNode('span', {className: "fw-bold text-muted"}, "收集的片段"),
    ]),
  ]);
};
