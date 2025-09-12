FROM registry.cn-heyuan.aliyuncs.com/szxuheng/nginx:0.0.4
# 将前端项目文件复制到Nginx的默认静态文件目录中
COPY dist/ /usr/share/nginx/html/
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]