import { createElement as vNode, Fragment, useState, useMemo, useEffect } from "../../../../vendor/react.js";
// import ReactRouterDom from "../../../../vendor/react-router-dom.js";
import MyViewPanelGroup from "../../components/MyViewPanelGroup.js";
import {
  Layout,
  Menu,
  Row,
  Col,
  Space,
  Switch,
  Tooltip,
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

import FileReaderDemoComments from "./file-reader-demo--comments.js";
import FileReaderDemoSettings from "./file-reader-demo--settings.js";
import FileReaderDemoCollections from "./file-reader-demo--collections.js";

function getCurrentDate(needTime = false) {
  const d = new Date();
  let month = d.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  const date = `${d.getFullYear()}-${month}-${d.getDate()}`;
  const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  if (needTime) return [date, time].join(' ')
  return date;
};



const getTagContent = tag => {
  if (Lodash.isString(tag)) {return tag};
  return tag?.label ?? tag?.value ?? tag?.face ?? tag?.content ?? tag?.text;
};



export default function FileReaderDemo() {

  // console.log(useState(null));

  const [userName, set_userName] = useState("");
  useEffect(async()=>{
    const init_userName = await storage?.getItem?.("userName") ?? "";
    set_userName(init_userName);
  }, []);
  const UserBlock = ()=>vNode('div', {className: "my-5"}, [
    vNode('h4', {className: "mb-3"}, "用户"),
    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      vNode('span', {className: "fw-bold text-muted"}, "用户名"),
      vNode(Tooltip, {
        content: "用于备注或留言的标识",
      }, vNode(Input, {
        theme: "normal", size: "small", align: "center",
        style: { width: 240, },
        placeholder: null,
        defaultValue: userName,
        value: userName,
        onChange: async(nv)=>{
          set_userName(nv);
          await storage.setItem("userName", nv);
        },
      })),
    ]),
  ]);



  const [files, set_files] = useState([]);
  const [current_file_info, set__current_file_info] = useState({});



  const [collectedMaterials, set_collectedMaterials] = useState([]);
  const [collectedFrags, set_collectedFrags] = useState([]);
  useEffect(async()=>{
    const init_collectedMaterials = await storage?.getItem?.("collectedMaterials") ?? [];
    if (init_collectedMaterials?.length) {set_collectedMaterials(init_collectedMaterials);};
    const init_collectedFrags = await storage?.getItem?.("collectedFrags") ?? [];
    if (init_collectedFrags?.length) {set_collectedFrags(init_collectedFrags);};
  }, []);
  const addToCollectedMaterials = async(item) => {
    const the_item = Object.assign({}, item);
    if (the_item?.source_file_name==null) {
      the_item.source_file_name = current_file_info?.name ?? undefined;
    };
    const foundIdx = Lodash.findIndex(collectedMaterials, {
      source_file_name: the_item.source_file_name,
      head: the_item.head,
      fidx: the_item.fidx,
      sidx: the_item.sidx,
    });
    if (foundIdx>-1) {
      const myDialog = DialogPlugin({
        header: "重复的项目",
        body: vNode('div', {className: "vstack gap-2"}, [
          vNode('p', {}, `该项目（「${the_item.source_file_name}」中的「${the_item.head}」）似乎已经存在于收集箱中，是要重复添加还是？`),
          vNode('p', {}, vNode(Button, {theme: "default", size: "small", onClick: async()=>{
            collectedMaterials[foundIdx]=the_item;
            set_collectedMaterials([...collectedMaterials]);
            await storage.setItem("collectedMaterials", collectedMaterials);
            myDialog.hide();
          }}, "对已有内容进行覆盖")),
        ]),
        confirmBtn: "重复添加",
        onConfirm: async({ event, trigger }) => {
          collectedMaterials.push(the_item);
          set_collectedMaterials([...collectedMaterials]);
          await storage.setItem("collectedMaterials", collectedMaterials);
          myDialog.hide();
        },
        onClose: ({ event, trigger }) => {
          myDialog.hide();
        },
      });
    } else {
      collectedMaterials.push(the_item);
      set_collectedMaterials([...collectedMaterials]);
      await storage.setItem("collectedMaterials", collectedMaterials);
    };
  };



  const [theMaterialTags, set_theMaterialTags] = useState([]);
  const [theFragTags, set_theFragTags] = useState([]);

  const proTags = async(json_content) => {
    const init_primaryMaterialTags = await storage?.getItem?.("primaryMaterialTags") ?? [];
    const init_primaryFragTags = await storage?.getItem?.("primaryFragTags") ?? [];
    const materialTagWraps = [init_primaryMaterialTags, theMaterialTags];
    const fragTagWraps = [init_primaryFragTags, theFragTags];
    for (const item of json_content) {
      if (item.tags?.length) {materialTagWraps.push(item.tags);};
      (item?.nlp_outputs??[]).forEach(it=>{if (it.tags?.length) {fragTagWraps.push(it.tags);};});
    };
    set_theMaterialTags(Lodash.uniq(materialTagWraps.flat().map(tag=>getTagContent(tag))));
    set_theFragTags(Lodash.uniq(fragTagWraps.flat().map(tag=>getTagContent(tag))));
  };

  const requestMethod = async (file_or_files) => {
    // 自定义加载方法。
    // 返回值 status 表示加载成功或失败，error 或 response.error 表示加载失败的原因，response 表示请求加载成功后的返回数据，response.url 表示加载成功后的图片地址。
    // 示例一：{ status: 'fail', error: '加载失败', response }。示例二：{ status: 'success', response: { url: 'https://tdesign.gtimg.com/site/avatar.jpg' } }。
    return new Promise((resolve, reject) => {
      try {
        if (file_or_files==null) {
          file_or_files=[];
        } else if (file_or_files!=null && !Array.isArray(file_or_files)) {
          file_or_files = [file_or_files];
        };
        if (file_or_files?.length > 1) {
          file_or_files = [file_or_files[0]];
        };
        const fileWrap = file_or_files[0];
        // console.log('fileWrap\n', fileWrap);
        // console.log('fileWrap\n', JSON.stringify(fileWrap, null, 2));

        const file = fileWrap?.raw;
        if (file==null) {throw "file is null."};
        const fileReader = new FileReader();

        fileReader.onload = (event) => {
          // console.log('fileReader onload');
          // console.log(fileReader.result);
          resolve({
            status: 'success',
            event: event,
            response: {
              url: "https://tdesign.gtimg.com/site/avatar.jpg",
              textContent: fileReader.result,
            },
          });
        };

        fileReader.onerror = (event) => {
          console.log('fileReader onerror');
          reject({
            status: 'fail',
            error: '加载失败: fileReader onerror',
            event: event,
            response: {
              url: "https://tdesign.gtimg.com/site/avatar.jpg",
            },
          });
        };

        fileReader.onabort = (event) => {
          console.log('fileReader onabort');
          reject({
            status: 'fail',
            error: '加载失败: fileReader onabort',
            event: event,
            response: {
              url: "https://tdesign.gtimg.com/site/avatar.jpg",
            },
          });
        };

        fileReader.readAsText(file);

      } catch(err) {
        reject({
          status: 'fail',
          error: `加载失败: ${err}`,
          err: err,
          response: {
            url: "https://tdesign.gtimg.com/site/avatar.jpg",
          },
        });
      };
    });
  };

  const formatResponse = (res) => {
    // 响应结果添加加载时间字段，用于 UI 显示
    res.uploadTime = getCurrentDate();
    console.log('res\n', res);
    return res;
  };
  const onFail = (context) => {
    console.log('uploadFailContext\n', context);
    MessagePlugin.error('加载失败: 请管理员在控制台查看细节');
  };




  const [cached_content, set_cached_content] = useState(null);
  useEffect(async()=>{
    const init_cached_content = await storage?.getItem?.("cached_content") ?? null;
    set_cached_content(init_cached_content);
  }, []);

  const [data_list, set__data_list] = useState([]);
  const [data_idx_control__main_idx, set__data_idx_control__main_idx] = useState(0);
  const [data_idx_control__nlp_idx, set__data_idx_control__nlp_idx] = useState(0);
  const data_item = useMemo(()=>{
    return data_list?.[data_idx_control__main_idx??0]
  }, [data_list, data_idx_control__main_idx]);
  const nlp_data = useMemo(()=>{
    return (data_item?.nlp_outputs??[])[data_idx_control__nlp_idx];
  }, [data_item?.nlp_outputs, data_idx_control__nlp_idx]);

  const nlp_item_num = useMemo(()=>{
    return Lodash.sum(data_list.map(it=>(it?.nlp_outputs?.length??0)));
  }, [data_list]);

  const total_char_num = useMemo(()=>{
    return Lodash.sum(
      data_list.map(
        it=>Lodash.sum((it?.nlp_outputs??[]).map(iq=>iq?.text?.length??0))
      )
    );
  }, [data_list]);

  const onSuccess = async(context) => {
    const textContent = context?.response?.textContent;
    if (!textContent?.length) {
      MessagePlugin.error('加载失败: 没有文本内容');
      return;
    };
    let jsonContent;
    const pro = async(json_content) => {
      set__data_list(json_content);
      const all_fidxes = Lodash.uniq(json_content.map(it=>it?.fidx)).filter(it=>it!=null);
      const new_file_info = {
        name: context?.file?.name,
        fidx: all_fidxes.length==1 ? all_fidxes[0] : undefined,
      };
      set__current_file_info(new_file_info);

      await proTags(json_content);
    };

    try {
      jsonContent = JSON.parse(textContent);
      if (!Array.isArray(jsonContent)) {
        // TODO
        // jsonContent = [jsonContent];
      };
      await pro(jsonContent);

      MessagePlugin.success('加载成功 (json)');
      return;
    } catch (json_error) {
      try {
        jsonContent = textContent.split("\n").filter(it=>it.length).map(it=>JSON.parse(it));
        await pro(jsonContent);

        MessagePlugin.success('加载成功 (jsonlines)');
        return;
      } catch (jsonlines_error) {
        MessagePlugin.error('加载失败: 无法解析的 json 或 jsonlines 内容');
        return;
      };
    };
  };

  const toPrueMaterial = (data_list)=>{
    return data_list.map(it=>({
      head: it?.head,
      fidx: it?.fidx,
      sidx: it?.sidx,
      nlp_outputs: (it?.nlp_outputs??[]).map(li=>({
        text: li?.text,
        frag_idx: li?.frag_idx,
      })),
    }))
  };
  const toPrueMaterialTxt = (data_list)=>{
    const lines = [];
    if (current_file_info?.name?.length) {lines.push(`filename: ${current_file_info?.name}`);};
    if (current_file_info?.fidx!=null) {lines.push(`fidx: ${current_file_info.fidx}`);};
    if (lines.length) {lines.push("");};
    for (const it of data_list) {
      lines.push("");
      if (it?.fidx!=null) {lines.push(`fidx: ${it.fidx}`);};
      if (it?.sidx!=null) {lines.push(`sidx: ${it.sidx}`);};
      if (it?.head?.length) {lines.push(`head: ${it.head}`);};
      if (it?.nlp_outputs?.length) {lines.push(`main:`);};
      for (const li of (it?.nlp_outputs??[])) {
        const idx_p = li?.frag_idx==null ? "" : `[${li.frag_idx}] `;
        lines.push(`${idx_p}${li?.text}`);
      };
      lines.push("");
    };
    return lines.join("\n");
  };


  const FileBlock = ()=>vNode('div', {className: "my-5"}, [
    vNode('h4', {className: "mb-3"}, "文件"),
    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      false ? null : [
        vNode('span', {className: "fw-bold text-muted"}, "选择文件"),
        vNode(Upload, {
          // className: "mx-auto",
          theme: 'file',  // file | file-flow
          autoUpload: true,
          multiple: false,
          data: { extraData: 123, fileName: 'certificate' },
          draggable: true,
          action: null,
          requestMethod: requestMethod,
          files: files,
          formatResponse: formatResponse,
          onChange: set_files,
          onFail: onFail,
          onSuccess: onSuccess,
        }),
      ],
    ]),
    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      current_file_info?.name==null ? null : [
        vNode('span', {className: "fw-bold text-muted"}, "文件名"),
        current_file_info.name,
      ],
    ]),
    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      current_file_info?.fidx==null ? null : [
        vNode('span', {className: "fw-bold text-muted"}, "手工编号"),
        current_file_info.fidx,
      ],
    ]),
    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      (!data_list?.length) ? null : [
        vNode('span', {className: "fw-bold text-muted"}, "条目数量"),
        data_list.length,
      ],
    // ]),
    // vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      (!nlp_item_num) ? null : [
        vNode('span', {className: "fw-bold text-muted"}, "片段数量"),
        nlp_item_num,
      ],
      (!total_char_num) ? null : [
        vNode('span', {className: "fw-bold text-muted"}, "总字符数"),
        total_char_num,
      ],
    ]),
    vNode('div', {className: "my-1 hstack gap-1"}, [
      (!data_list?.length)&&(cached_content==null) ? null :
      vNode('span', {className: "fw-bold text-muted"}, "缓存操作"),
      (!data_list?.length) ? null :
      vNode(Tooltip, {
        content: "将当前文件内容保存到浏览器缓存中，请注意：会取代缓存中已有的内容",
      }, vNode(Button, {
        theme: "default", size: "small", onClick: async()=>{
          const new_cached_content = {current_file_info: current_file_info, data_list: data_list};
          await storage.setItem("cached_content", new_cached_content).then(()=>{
            set_cached_content(new_cached_content);
            MessagePlugin.success("已保存");
          });
        },
      }, "保存到缓存")),
      cached_content==null ? null :
      vNode(Tooltip, {
        content: "从浏览器缓存中读取内容",
      }, vNode(Button, {
        theme: "default", size: "small", onClick: async()=>{
          set__current_file_info(cached_content?.current_file_info);
          set__data_list(cached_content?.data_list);
          await proTags(cached_content?.data_list);
          MessagePlugin.success("已读取");
        },
      }, "从缓存读取")),
      cached_content==null ? null :
      vNode(Tooltip, {
        content: "将浏览器缓存中的内容清除",
      }, vNode(Button, {
        theme: "default", size: "small", onClick: async()=>{
          await storage.removeItem("cached_content").then(()=>{
            set_cached_content(null);
            MessagePlugin.warning("已清除");
          });
        },
      }, "清除缓存")),
    ]),
    (!data_list?.length) ? null :
    vNode('div', {className: "my-1 hstack gap-1"}, [
      vNode('span', {className: "fw-bold text-muted"}, "仅导出语料为"),
      vNode(Tooltip, {
        content: "仅导出语料(而不包括NLP分析结果及标签、备注/评论等)到TXT文件",
      }, vNode(Button, {
        theme: "default", size: "small", onClick: ()=>{
          const prue_data_txt = toPrueMaterialTxt(data_list);
          saveText(prue_data_txt, `${(current_file_info?.name??"").replace(/\.[^\.]+$/g, "")}[仅语料].txt`);
          MessagePlugin.success("已导出");
        },
      }, "TXT")),
      vNode(Tooltip, {
        content: "仅导出语料(而不包括NLP分析结果及标签、备注/评论等)到JSON文件",
      }, vNode(Button, {
        theme: "default", size: "small", onClick: ()=>{
          const prue_data_list = toPrueMaterial(data_list);
          saveIt(prue_data_list, `${(current_file_info?.name??"").replace(/\.[^\.]+$/g, "")}[仅语料].json`);
          MessagePlugin.success("已导出");
        },
      }, "JSON")),
      vNode(Tooltip, {
        content: "仅导出语料(而不包括NLP分析结果及标签、备注/评论等)到JSON Lines文件",
      }, vNode(Button, {
        theme: "default", size: "small", onClick: ()=>{
          const prue_data_list = toPrueMaterial(data_list);
          saveLines(prue_data_list, `${(current_file_info?.name??"").replace(/\.[^\.]+$/g, "")}[仅语料].jsonl`);
          MessagePlugin.success("已导出");
        },
      }, "JSONL")),
    ]),
    (!data_list?.length) ? null :
    vNode('div', {className: "my-1 hstack gap-1"}, [
      vNode('span', {className: "fw-bold text-muted"}, "全部导出为"),
      vNode(Tooltip, {
        content: "尤其在修改过标签或备注之后，请记得导出",
      }, vNode(Button, {
        theme: "default", size: "small", onClick: ()=>{
          saveLines(data_list, current_file_info?.name);
          MessagePlugin.success("已导出");
        },
      }, "JSONL")),
    ]),
  ]);



  const go_nth_item = (idx) => {
    const min_idx = 0;
    const max_idx = (data_list?.length??0)-1;
    if (idx >= min_idx && idx <= max_idx) {
      if (data_idx_control__main_idx!=idx) {
        set__data_idx_control__main_idx(idx);
        set__data_idx_control__nlp_idx(0);
        return true;
      };
      MessagePlugin.info("无变化");
      return false;
    };
    MessagePlugin.info("超出范围了");
    return false;
  };
  const go_previous_item = () => {
    const main_idx = data_idx_control__main_idx??0;
    go_nth_item(main_idx-1);
  };
  const go_next_item = () => {
    const main_idx = data_idx_control__main_idx??0;
    go_nth_item(main_idx+1);
  };

  const MaterialBlock = ()=>vNode('div', {className: "my-5"}, [
    vNode('h4', {className: "mb-3"}, "当前条目"),
    vNode('div', {className: "my-1 hstack gap-1"}, [
      vNode(Button, { theme: "default", size: "small", onClick: ()=>{go_previous_item()}, }, "上一条"),
      vNode(InputNumber, {
        theme: "normal", size: "small", align: "center",
        style: { width: 160, },
        placeholder: null,
        defaultValue: (1+(+data_idx_control__main_idx)),
        value: (1+(+data_idx_control__main_idx)),
        onChange: (nv)=>{go_nth_item(nv-1)},
        label: "第", suffix: `条/共${data_list?.length??0}条`,
      }),
      vNode(Button, { theme: "default", size: "small", onClick: ()=>{go_next_item()}, }, "下一条"),
    ]),
    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      data_item?.head==null ? null : [
        vNode('span', {className: "fw-bold text-muted"}, "标题"),
        vNode('code', {}, data_item.head),
      ],
    ]),
    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      // vNode('span', {className: "fw-bold text-muted"}, "序号"),
      // (1+(+data_idx_control__main_idx)),
    // ]),
    // vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      data_item?.sidx==null ? null : [
        vNode('span', {className: "fw-bold text-muted"}, "手工编号"),
        data_item.sidx,
      ],
    // ]),
    // vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      vNode('span', {className: "fw-bold text-muted"}, "总字符数"),
      vNode('span', {}, Lodash.sum((data_item?.nlp_outputs??[]).map(it=>it?.text?.length))),
    ]),


    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      false ? null : [
        vNode('span', {className: "fw-bold text-muted"}, "标签"),
        vNode(Select, {
          placeholder: "选择或输入并回车",
          multiple: true,
          filterable: true,
          creatable: true,
          clearable: true,
          options: theMaterialTags.map(tag=>({label: tag, value: tag})),
          value: (data_item?.tags??[]),
          defaultValue: (data_item?.tags??[]),
          onChange: (new_tag_list)=>{
            // console.log(new_tag_list);
            const the_data_list = data_list;
            the_data_list[data_idx_control__main_idx].tags = [...new_tag_list];
            set__data_list([...the_data_list]);
          },
          onCreate: (new_tags)=>{
            const new_theMaterialTags= Lodash.uniq([...theMaterialTags, ...new_tags]);
            set_theMaterialTags([...new_theMaterialTags]);
          },
        }),
        vNode(Checkbox.Group, {
          options: theMaterialTags.map(tag=>({label: tag, value: tag})),
          value: (data_item?.tags??[]),
          defaultValue: (data_item?.tags??[]),
          onChange: (new_tag_list)=>{
            // console.log(new_tag_list);
            const the_data_list = data_list;
            the_data_list[data_idx_control__main_idx].tags = [...new_tag_list];
            set__data_list([...the_data_list]);
          },
        }),
      ],
    ]),
    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      false ? null : [
        vNode('span', {className: "fw-bold text-muted"}, "评论或备注"),
      ],
    ]),
    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      false ? null : [
        vNode(FileReaderDemoComments, {
          userName: userName,
          comments: (data_item?.comments??[]),
          onChange: (newComments)=>{
            // console.log(newComments);
            const the_data_list = data_list;
            the_data_list[data_idx_control__main_idx].comments = [...newComments];
            set__data_list([...the_data_list]);
          },
        }),
      ],
    ]),
    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      false ? null : [
        vNode('span', {className: "fw-bold text-muted"}, "操作"),
        vNode(Button, { theme: "default", size: "small", onClick: async()=>{
          await addToCollectedMaterials(data_item);
        }, }, "添加到收集箱")
      ],
    ]),

    vNode('div', {className: "mt-3 mb-1 hstack gap-2 flex-wrap"}, [
      vNode('span', {className: "fw-bold text-muted"}, "各文本片段"),
      vNode('div', {className: "hstack gap-1 flex-wrap"}, (data_item?.nlp_outputs??[]).map((nlp_item, idx)=>vNode('button', {
        type: "button",
        className: [
          "me-3",
          "btn btn-sm",
          nlp_item?.fav ? (
            idx==data_idx_control__nlp_idx ? "btn-danger" : "btn-outline-danger"
          ) : (
            idx==data_idx_control__nlp_idx ? "btn-primary" : "btn-outline-secondary"
          ),
          "position-relative",
        ].join(" "),
        onClick: ()=>{set__data_idx_control__nlp_idx(idx);},
      }, [
        // nlp_item?.frag_idx==null ? null : vNode('span', {}, `[${nlp_item?.frag_idx}]`),
        vNode('span', {}, `[${idx+1}] `),
        vNode('span', {}, `${nlp_item?.text??"<无内容>"}`),
        !nlp_item?.tags?.length ? null : vNode('span', {
          className: ["position-absolute top-0 start-100 translate-middle", "badge rounded-pill bg-secondary"].join(" "),
          title: `含${nlp_item?.tags?.length}个标签`,
        }, `${nlp_item?.tags?.length}`),
      ]))),
    ]),

  ]);



  const go_previous_nlp_idx = () => {
    const min_idx = 0;
    const nlp_idx = data_idx_control__nlp_idx??0;
    if (nlp_idx > min_idx) {
      set__data_idx_control__nlp_idx(nlp_idx-1);
    } else {MessagePlugin.info("没有啦");};
  };
  const go_next_nlp_idx = () => {
    const max_idx = (data_item?.nlp_outputs?.length??0)-1;
    const nlp_idx = data_idx_control__nlp_idx??0;
    if (nlp_idx < max_idx) {
      set__data_idx_control__nlp_idx(nlp_idx+1);
    } else {MessagePlugin.info("没有啦");};
  };

  const FragBlock = ()=>vNode('div', {className: "my-5"}, [
    vNode('h4', {className: "mb-3"}, "当前片段"),
    vNode('div', {className: "my-1 hstack gap-1"}, [
      vNode(Button, { theme: "default", size: "small", onClick: ()=>{go_previous_nlp_idx()}, }, "上一个"),
      vNode('span', {}, `第${(1+(+data_idx_control__nlp_idx))}个/共${data_item?.nlp_outputs?.length??0}个`),
      vNode(Button, { theme: "default", size: "small", onClick: ()=>{go_next_nlp_idx()}, }, "下一个"),
    ]),
    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      nlp_data?.text==null ? null : [
        vNode('span', {className: "fw-bold text-muted"}, "内容"),
        vNode('code', {}, nlp_data.text),
      ],
    ]),
    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      // vNode('span', {className: "fw-bold text-muted"}, "序号"),
      // (1+(+data_idx_control__nlp_idx)),
    // ]),
    // vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      nlp_data?.frag_idx==null ? null : [
        vNode('span', {className: "fw-bold text-muted"}, "手工编号"),
        nlp_data.frag_idx,
      ],
    // ]),
    // vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      nlp_data?.text==null ? null : [
        vNode('span', {className: "fw-bold text-muted"}, "字符数"),
        vNode('span', {}, nlp_data.text?.length),
      ],
    ]),

    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      false ? null : [
        vNode('span', {className: "fw-bold text-muted"}, "星标"),
        vNode(Switch, {
          value: nlp_data?.fav ?? false,
          onChange: (newValue)=>{
            const the_data_list = data_list;
            the_data_list[data_idx_control__main_idx].nlp_outputs[data_idx_control__nlp_idx].fav = newValue ? newValue : undefined;
            set__data_list([...the_data_list]);
          },
        }),
      ],
    ]),

    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      false ? null : [
        vNode('span', {className: "fw-bold text-muted"}, "标签"),
        vNode(Select, {
          placeholder: "选择或输入并回车",
          multiple: true,
          filterable: true,
          creatable: true,
          clearable: true,
          options: theFragTags.map(tag=>({label: tag, value: tag})),
          value: (nlp_data?.tags??[]),
          defaultValue: (nlp_data?.tags??[]),
          onChange: (new_tag_list)=>{
            // console.log(new_tag_list);
            const the_data_list = data_list;
            the_data_list[data_idx_control__main_idx].nlp_outputs[data_idx_control__nlp_idx].tags = [...new_tag_list];
            set__data_list([...the_data_list]);
          },
          onCreate: (new_tags)=>{
            const new_theFragTags= Lodash.uniq([...theFragTags, ...new_tags]);
            set_theFragTags([...new_theFragTags]);
          },
        }),
        vNode(Checkbox.Group, {
          options: theFragTags.map(tag=>({label: tag, value: tag})),
          value: (nlp_data?.tags??[]),
          defaultValue: (nlp_data?.tags??[]),
          onChange: (new_tag_list)=>{
            // console.log(new_tag_list);
            const the_data_list = data_list;
            the_data_list[data_idx_control__main_idx].nlp_outputs[data_idx_control__nlp_idx].tags = [...new_tag_list];
            set__data_list([...the_data_list]);
          },
        }),
      ],
    ]),

    vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
      vNode('span', {className: "fw-bold text-muted"}, "结构可视化"),
    ]),
    vNode(MyViewPanelGroup, {
      data: nlp_data,
      key: `[${data_idx_control__main_idx}][${data_idx_control__nlp_idx}]${nlp_data?.text}`,
    }),
  ]);



  return vNode('div', null, [
    UserBlock(),
    FileBlock(),

    (!data_list?.length) ? null :
    MaterialBlock(),

    nlp_data==null ? null :
    FragBlock(),

    vNode('div', {className: "my-5"}, [
      vNode('h4', {className: "mb-3"}, "收集箱"),
      vNode(FileReaderDemoCollections, {
        collectedMaterials: collectedMaterials,
        collectedFrags: collectedFrags,
        onSetCollectedMaterials: set_collectedMaterials,
        onSetCollectedFrags: set_collectedFrags,
        appData: {
          current_file_info,
          data_list,
        },
        onAppDataChange: (newAppData)=>{
          console.log(newAppData);
          set__current_file_info(newAppData?.current_file_info);
          set__data_list(newAppData?.data_list);
        },
      }),
    ]),

    vNode('div', {className: "my-5"}, [
      vNode('h4', {className: "mb-3"}, "设置"),
      vNode(FileReaderDemoSettings, {
        materialTags: theMaterialTags,
        fragTags: theFragTags,
        onSetMaterialTags: set_theMaterialTags,
        onSetFragTags: set_theFragTags,
      }),
    ]),

    // vNode('div', {className: "my-2"}, [`${JSON.stringify(nlp_data)}`]),
    // vNode('div', {className: "my-2"}, [`${JSON.stringify(data_list)}`]),
  ]);
};
