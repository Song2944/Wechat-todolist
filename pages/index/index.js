//必须通过调用一个全局的Page方法
Page({
    data:{
        input:"",//input初始值
        leftCount:0,
        haveChild:false,
        todos:[],
        logs:[],
    },
     //当回车(完成按钮)会触发这个函数(用于添加任务)
     save: function(){
         wx.setStorageSync('todo_list', this.data.todos);//本地缓存的key，需要存储的key
         wx.setStorageSync('todo_logs', this.data.logs);
     },
     load: function(){
         var todos = wx.getStorageSync('todo_list');
         var logs = wx.getStorageSync('todo_logs');
         var leftCount = todos.length;
         var haveChild = this.data.haveChild;
         if(todos){
             this.setData({
                 todos : todos,
                 leftCount : leftCount,
                 haveChild : true,
             })
         }
         
         if(logs){
             this.setData({ logs : logs })
         }
     },
     //页面的生命周期
     onLoad: function(){
         this.load();
     },
    addTodosHandle: function(e){
        var todos = this.data.todos;
        var leftCount = this.data.leftCount;
        var haveChild = this.data.havaChild;
        if( e.detail.value == "" ){
            return ;
        }
        todos.push({
            name : e.detail.value,
            completed : false
        })
        var logs = this.data.logs;
        logs.push({
            timestamp: new Date(),
            action: "新增",
            name: e.detail.value
        })
        leftCount  += 1;
        haveChild = true;
        this.setData({
            todos : todos,
            leftCount : leftCount,
            haveChild : haveChild,
            input : "",
            logs: logs
        })
        this.save();
     },
      //点击切换事件完成状态
     toggleTodoHandle: function(e){
        var index = e.currentTarget.dataset.index;
        var todos = this.data.todos;
        todos[index].completed = !todos[index].completed;
        var logs = this.data.logs;
        if( todos[index].completed ){
            logs.push({
                timestamp: new Date(),
                action: "标记完成",
                name: this.data.todos[index].name
            })
        }else{
            logs.push({
                timestamp: new Date(),
                action: "标记未完成",
                name: this.data.todos[index].name
            })
        }
        this.setData({
            todos : todos,
            logs : logs,
        })
        this.save();
     },

     //点击toggle all进行全选/全不选切换
     toggleChangeAll : function(e){
         var todos = this.data.todos;
         var logs = this.data.logs;
         //如果用户还没有添加一个任务请单的情况
         if( todos.length == 0 ){
             wx.showModal({
                title: '提示',
                content: '您还没有添加任务清单',
                success: function(res) {
                    if (res.confirm) {
                    }
                }
            })
            return;
         }
         var isAllChange = false; //假设所有的都是未完成状态
         //循环遍历看是否都是已完成状态
         for( var i = 0; i < todos.length; i++ ){
             if( !todos[i].completed ){
                isAllChange = true;
             }
         }
         if( !isAllChange ){
            this.todosFor(false);
            isAllChange = !isAllChange;
         }else{
            this.todosFor(true);
             isAllChange = !isAllChange;
         }
         logs.push({
            timestamp: new Date(),
            action: isAllChange ? '标记完成' : '标记未完成',
            name: "全部任务"
          })
        this.setData({
            todos : todos,
            logs : logs
        })
        this.save();
     },
     //用于循环设置任务清单的全选与全不选切换
     todosFor: function(a){
        for( var i = 0; i < this.data.todos.length; i++ ){
            this.data.todos[i].completed = a;
        }
     },
     //用于清除所有已完成的任务清单
     clearAll: function(){
         var todos = this.data.todos;
         var haveChild = this.data.haveChild;
         var leftCount = this.data.leftCount;
         var logs = this.data.logs;
         var newArr = todos.filter( function( element,todos){
             if( element.completed ){
                 return false;
             }
             return true;
         });
         if( newArr.length <= 0 ){
            haveChild = false;
         }else{
             haveChild = true;
         }
         leftCount = newArr.length;
         logs.push({
            timestamp: new Date(),
            action: "清除",
            name: "已标记完成的任务"
          })
         this.setData({
             todos : newArr,
             haveChild : haveChild,
             leftCount : leftCount,
             logs : logs,
         })
         this.save();
     },
     //单独删除
     clearOne: function(e){
        var todos = this.data.todos;
        var index = e.currentTarget.dataset.index;
        var leftCount = this.data.leftCount;
        var haveChild = this.data.haveChild;
        var logs = this.data.logs;
        todos.splice(index,1);
        leftCount = leftCount-1;
        if(todos.length <= 0){
            haveChild = false;
        }else{
            haveChild = true;
        }
        logs.push({
            timestamp: new Date(),
            action: "清除",
            name:this.data.todos[index].name,
        })
        this.setData({
             todos : todos,
             leftCount : leftCount,
             haveChild : haveChild,
             logs : logs,
         })
     }
})