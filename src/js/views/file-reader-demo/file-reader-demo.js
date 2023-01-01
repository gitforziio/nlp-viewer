import { createElement as vNode, Fragment, useState, useMemo } from "../../../../vendor/react.js";
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

function getCurrentDate(needTime = false) {
  const d = new Date();
  let month = d.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  const date = `${d.getFullYear()}-${month}-${d.getDate()}`;
  const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  if (needTime) return [date, time].join(' ')
  return date;
};

export default function FileReaderDemo() {
  const [files, setFiles] = useState([]);
  const [autoUpload, setAutoUpload] = useState(true);
  const [multiple, setMultiple] = useState(false);
  const [theme, setTheme] = useState('file');  // file | file-flow

  const [current_file_info, set__current_file_info] = useState({});

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
          console.log('fileReader onload');
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



  const [data_list, set_data_list] = useState([]);
  const [data_item, set_data_item] = useState({});
  const [data_idx_control__main_idx, set__data_idx_control__main_idx] = useState(0);
  const [data_idx_control__nlp_idx, set__data_idx_control__nlp_idx] = useState(0);
  const nlp_data = useMemo(()=>{
    return (data_item?.nlp_outputs??[])[data_idx_control__nlp_idx];
  }, [data_item?.nlp_outputs, data_idx_control__nlp_idx]);

  const set_content = (content) => {
    console.log(content);
    set_data_list(content);
    set_data_item(content?.[data_idx_control__main_idx??0]);
  };
  const go_previous_item = () => {
    const min_idx = 0;
    const main_idx = data_idx_control__main_idx??0;
    if (main_idx > min_idx) {
      set__data_idx_control__main_idx(main_idx-1);
      set_data_item(data_list?.[main_idx-1]);
      set__data_idx_control__nlp_idx(0);
    } else {MessagePlugin.info("没有啦");};
  };
  const go_next_item = () => {
    console.log("FLAG1");
    const max_idx = (data_list?.length??0)-1;
    const main_idx = data_idx_control__main_idx??0;
    if (main_idx < max_idx) {
      set__data_idx_control__main_idx(main_idx+1);
      set_data_item(data_list?.[main_idx+1]);
      set__data_idx_control__nlp_idx(0);
    } else {MessagePlugin.info("没有啦");};
    console.log("FLAG2");
  };
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

  const onSuccess = (context) => {
    console.log('context keys\n', Object.keys(context));
    console.log('context\n', context);
    console.log('context?.file\n', context?.file);
    const textContent = context?.response?.textContent;
    if (!textContent?.length) {
      MessagePlugin.error('加载失败: 没有文本内容');
      return;
    };
    let jsonContent;

    const pro = (json_content) => {
      set_content(json_content);
      const new_file_info = {
        name: context?.file?.name,
        fidx: json_content?.[0]?.fidx,
      };
      console.log("new_file_info", new_file_info);
      set__current_file_info(new_file_info);
    };

    try {
      jsonContent = JSON.parse(textContent);
      if (!Array.isArray(jsonContent)) {jsonContent = [jsonContent]};
      pro(jsonContent);

      MessagePlugin.success('加载成功 (json)');
      return;
    } catch (json_error) {
      try {
        jsonContent = textContent.split("\n").filter(it=>it.length).map(it=>JSON.parse(it));
        pro(jsonContent);

        MessagePlugin.success('加载成功 (jsonlines)');
        return;
      } catch (jsonlines_error) {
        MessagePlugin.error('加载失败: 无法解析的 json 或 jsonlines 内容');
        return;
      };
    };
  };

  return vNode('div', null, [
    vNode('div', {className: "my-4"}, [
      vNode('h4', {}, "文件"),
      vNode(Upload, {
        // className: "mx-auto",
        theme: theme,
        autoUpload: autoUpload,
        multiple: multiple,
        data: { extraData: 123, fileName: 'certificate' },
        draggable: true,
        action: null,
        requestMethod: requestMethod,
        files: files,
        formatResponse: formatResponse,
        onChange: setFiles,
        onFail: onFail,
        onSuccess: onSuccess,
      }),
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
      ]),
    ]),

    (!data_list?.length) ? null :
    vNode('div', {className: "my-4"}, [
      vNode('h4', {}, "当前条目"),
      vNode('div', {className: "my-1 hstack gap-1"}, [
        vNode(Button, { theme: "default", size: "small", onClick: ()=>{go_previous_item()}, }, "上一条"),
        vNode(Button, { theme: "default", size: "small", onClick: ()=>{go_next_item()}, }, "下一条"),
      ]),
      vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
        data_item?.head==null ? null : [
          vNode('span', {className: "fw-bold text-muted"}, "标题"),
          vNode('code', {}, data_item.head),
        ],
      ]),
      vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
        vNode('span', {className: "fw-bold text-muted"}, "序号"),
        (1+(+data_idx_control__main_idx)),
      // ]),
      // vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
        data_item?.sidx==null ? null : [
          vNode('span', {className: "fw-bold text-muted"}, "手工编号"),
          data_item.sidx,
        ],
      ]),
      vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
        vNode('span', {className: "fw-bold text-muted"}, "各文本片段"),
      ]),
      vNode('div', {className: "my-1 hstack gap-1 flex-wrap"}, (data_item?.nlp_outputs??[]).map((nlp_item, idx)=>vNode('button', {
        type: "button",
        className: [
          "btn btn-sm",
          idx==data_idx_control__nlp_idx?"btn-outline-primary":"btn-light"
        ].join(" "),
        onClick: ()=>{set__data_idx_control__nlp_idx(idx);},
      }, [
        nlp_item?.frag_idx==null ? null : vNode('span', {}, `[${nlp_item?.frag_idx}]`),
        vNode('span', {}, `${nlp_item?.text??"<无内容>"}`),
        // nlp_item?.text??"<无内容>",
      ]))),
    ]),

    nlp_data==null ? null :
    vNode('div', {className: "my-4"}, [
      vNode('h4', {}, "当前片段"),
      vNode('div', {className: "my-1 hstack gap-1"}, [
        vNode(Button, { theme: "default", size: "small", onClick: ()=>{go_previous_nlp_idx()}, }, "上一个"),
        vNode(Button, { theme: "default", size: "small", onClick: ()=>{go_next_nlp_idx()}, }, "下一个"),
      ]),
      vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
        nlp_data?.text==null ? null : [
          vNode('span', {className: "fw-bold text-muted"}, "内容"),
          vNode('code', {}, nlp_data.text),
        ],
      ]),
      vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
        vNode('span', {className: "fw-bold text-muted"}, "序号"),
        (1+(+data_idx_control__nlp_idx)),
      // ]),
      // vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
        nlp_data?.frag_idx==null ? null : [
          vNode('span', {className: "fw-bold text-muted"}, "手工编号"),
          nlp_data.frag_idx,
        ],
      ]),

      vNode('div', {className: "my-1 hstack gap-2 flex-wrap"}, [
        vNode('span', {className: "fw-bold text-muted"}, "结构可视化"),
      ]),
      vNode(MyViewPanelGroup, {
        data: nlp_data,
        key: `[${data_idx_control__main_idx}][${data_idx_control__nlp_idx}]${nlp_data?.text}`,
      }),
    ]),

    // vNode('div', {className: "my-2"}, [`${JSON.stringify(nlp_data)}`]),
    // vNode('div', {className: "my-2"}, [`${JSON.stringify(data_list)}`]),
  ]);
};
