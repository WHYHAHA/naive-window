# dog-star

天狼星 基于 VUE3 框架的模拟Windows 桌面效果，后台管理UI。 [文档链接](https://gitee.com/ispace-code/dogstar-ui) 

二次开发 ui框架使用 naive ui  [UI框架链接](https://www.naiveui.com/zh-CN/os-theme)

## 相关打包配置
npm install
npm run build

更改development的VUE_APP_API_BASE_URL 来更改后台接口地址

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

web-portal                                 
├─ nginx                                   
│  └─ nginx.conf                           
├─ public                                  
│  ├─ static                               
│  ├─ favicon.ico                          
│  └─ index.html                           
├─ src                                     
│  ├─ api                  apiServe 管理              
│  │  ├─ breedingPlan.js                   
│  │  ├─ dictionariesManage.js             
│  │  ├─ dormManage.js                     
│  │  ├─ exExport.js                       
│  │  ├─ exImport.js                       
│  │  ├─ pigAblactation.js                 
│  │  ├─ pigAbortion.js                    
│  │  ├─ pigBreeding.js                    
│  │  ├─ pigCastration.js                  
│  │  ├─ pigChildBirth.js                  
│  │  ├─ pigDeath.js                       
│  │  ├─ pigDiagnosis.js                   
│  │  ├─ pigEliminate.js                   
│  │  ├─ pigFile.js                        
│  │  ├─ pigFormula.js                     
│  │  ├─ pigGoToBed.js                     
│  │  ├─ pigHealthCare.js                  
│  │  ├─ pigMeasure.js                     
│  │  ├─ pigMedicalTreatment.js            
│  │  ├─ pigOptional.js                    
│  │  ├─ pigOutOfBed.js                    
│  │  ├─ pigPharmacy.js                    
│  │  ├─ pigPregnancy.js                   
│  │  ├─ pigRegistration.js                
│  │  ├─ pigRollIn.js                      
│  │  ├─ pigRollOut.js                     
│  │  ├─ pigSemenInventory.js              
│  │  ├─ pigVaccine.js                     
│  │  ├─ pigloveTime.js                    
│  │  ├─ public.js                         
│  │  ├─ user.js                           
│  │  └─ userManage.js                     
│  ├─ applications       应用页面                                    
│  │  └─ sys       系统应用页面                        
│  │     ├─ dictionariesManage     字典管理        
│  │     │  └─ list.vue                    
│  │     ├─ dormManage    栋舍管理                 
│  │     │  └─ list.vue                    
│  │     ├─ fileTransfer          文件传输         
│  │     │  └─ fileTransfer.vue            
│  │     ├─ sysLog             日志            
│  │     │  └─ log.vue                     
│  │     ├─ userInfo         用户信息              
│  │     │  └─ userInfo.vue                
│  │     ├─ userManage       用户管理              
│  │     │  ├─ department    部门              
│  │     │  │  └─ list.vue                 
│  │     │  ├─ job           角色              
│  │     │  │  └─ list.vue                 
│  │     │  └─ user          用户               
│  │     │     ├─ detail.vue               
│  │     │     └─ list.vue                 
│  │     ├─ calculator.vue                 
│  │     ├─ display.vue                    
│  │     ├─ help.vue                       
│  │     └─ preferences.vue                
│  ├─ assets                               
│  ├─ components      公共组件                     
│  │  ├─ 404.vue      404                     
│  │  ├─ addForList.vue  多个添加                  
│  │  ├─ exExport.vue    导出                 
│  │  ├─ exImport.vue    导入              
│  │  ├─ loading.vue     加载                  
│  │  ├─ message.vue     消息                  
│  │  ├─ minPigDetail.vue  查询单只猪                
│  │  ├─ notification.vue  通知                
│  │  ├─ printPigCard.vue  母猪卡打印                
│  │  ├─ printSemen.vue    精液出库打印                
│  │  ├─ publicComponents.vue   全局组件注册           
│  │  ├─ publicErrorPage.vue    全局500           
│  │  ├─ table.vue              table列表           
│  │  └─ windowErrorPage.vue    Windows500          
│  ├─ css                       全局css           
│  │  ├─ global.less                       
│  │  ├─ icon.less                         
│  │  ├─ nprogress.less                    
│  │  ├─ pc.css                            
│  │  └─ style.less                        
│  ├─ language               i18N              
│  │  ├─ en-US                                       
│  │  ├─ zh-CN                                
│  │  ├─ en.js                             
│  │  ├─ index.js                          
│  │  └─ zh.js                             
│  ├─ lazy           懒加载                      
│  │  ├─ icons.js    xicons懒加载 单个引入xicons 会导致打包全局打包xions  导致压缩过大                      
│  │  └─ lazy_echarts.js    echarts 懒加载               
│  ├─ register    注册表                         
│  │  └─ index.js                          
│  ├─ router      vueRouter                         
│  │  └─ index.js                          
│  ├─ store       vux                         
│  │  ├─ core.js                           
│  │  ├─ dictionaries.js                   
│  │  ├─ index.js                          
│  │  └─ message.js                        
│  ├─ utils       工具类                         
│  │  ├─ arrays.js    关于数组方法类                     
│  │  ├─ axios.js     axios全局配置                     
│  │  ├─ helper.js    工具类                       
│  │  ├─ http.js                        
│  │  ├─ observe.js   事件总线                     
│  │  ├─ print.js     打印                     
│  │  └─ request.js   请求方法封装                       
│  ├─ views           Windows窗口基础组件类                    
│  │  ├─ ContextMenu.vue                   
│  │  ├─ Desktop.vue                       
│  │  ├─ DialogModal.vue                   
│  │  ├─ Icon.vue                          
│  │  ├─ IconGrid.vue                      
│  │  ├─ LockScreen.vue                    
│  │  ├─ Sidebar.vue                       
│  │  ├─ Taskbar.vue                       
│  │  ├─ Wallpaper.vue                     
│  │  ├─ Window.vue                        
│  │  ├─ calendar.vue                      
│  │  ├─ drawer.vue                        
│  │  └─ login.vue                         
│  ├─ Monitor.vue                          
│  └─ main.js                              
├─ Dockerfile                              
├─ LICENSE                                 
├─ README.md         
├─ .env.development  本地环境    
├─ .env.prod         生产环境 
├─ .env.uat          测试环境           
├─ babel.config.js                         
├─ package-lock.json                       
├─ package.json                            
└─ vue.config.js                           
