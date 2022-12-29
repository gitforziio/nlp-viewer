import { createElement as vNode, Fragment, useState } from "../../../../vendor/react.js";
import ReactRouterDom from "../../../../vendor/react-router-dom.js";
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

function testJson() {};

function testJsonLines() {};

export default function FileReaderDemo() {
  const [files, setFiles] = useState([]);
  const [autoUpload, setAutoUpload] = useState(true);
  const [multiple, setMultiple] = useState(false);
  const [theme, setTheme] = useState('file');  // file | file-flow
  const formatResponse = (res) => {
    // 响应结果添加上传时间字段，用于 UI 显示
    res.uploadTime = getCurrentDate();
    console.log('res\n', res);
    return res;
  };
  const onFail = (context) => {
    console.log('uploadFailContext\n', context);
    MessagePlugin.error('加载失败');
  };
  const onSuccess = (context) => {
    console.log('context\n', context);
    MessagePlugin.success('加载成功');
  };

  const requestMethod = async (file_or_files) => {
    // 自定义上传方法。
    // 返回值 status 表示上传成功或失败，error 或 response.error 表示上传失败的原因，response 表示请求上传成功后的返回数据，response.url 表示上传成功后的图片地址。
    // 示例一：{ status: 'fail', error: '上传失败', response }。示例二：{ status: 'success', response: { url: 'https://tdesign.gtimg.com/site/avatar.jpg' } }。
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
        console.log('fileWrap\n', fileWrap);
        console.log('fileWrap\n', JSON.stringify(fileWrap, null, 2));

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

  return vNode('div', null, [
    vNode(Space, {}, [
      vNode(Upload, {
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
    ]),
  ]);
}