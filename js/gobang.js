var chess = document.getElementById('chess');
var context=chess.getContext('2d')//获得上下文
context.strokeStyle='#BFBFBF';
var chessBoard=[]
var me=true;

//赢法数组(三维数组，保存了五子棋的所以赢法)
var wins=[];
var myWin=[];//我方的赢法统计
var computerWin=[];//计算机赢法统计
var over=false;

//初始化二维数组（落子）
for(var i=0;i<15;i++){
	chessBoard[i]=[];
	for(var j=0;j<15;j++){
      chessBoard[i][j]=0;
	}
}

//初始化所以赢法（前面的两个维度代表的是棋盘）
for(var i=0;i<15;i++){
	wins[i]=[];
	for(var j=0;j<15;j++){
		wins[i][j]=[];
	}
}

var  count=0;//赢法种类的索引
//填充赢法数组(横线)
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
           wins[i][j+k][count]=true
		}
		count++; 
	}
}
//填充赢法数组(竖线)
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
           wins[j+k][i][count]=true
		}
		count++; 
	}
}

//填充赢法数组(斜綫)
for(var i=0;i<11;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
           wins[i+k][j+k][count]=true
		}
		count++; 
	}
}

//填充赢法数组(反斜綫)
for(var i=0;i<11;i++){
	for(var j=14;j>3;j--){
		for(var k=0;k<5;k++){
           wins[i+k][j-k][count]=true
		}
		count++; 
	}
}

console.log(count)

for(var i=0;i<count;i++){
	myWin[i]=0;
	computerWin[i]=0;
}

/*背景图片*/
/*var img=new Image();
img.src='images/ai.png';
img.onload=function(){
	context.drawImage(img,0,0,450,450);
	drawChessBoard();
}*/

//画棋盘
var drawChessBoard=function(){
	for (var i = 0; i<15; i++) {

		/*划竖线*/
		context.moveTo(15+i*30,15);
		context.lineTo(15+i*30,435);
	    context.stroke();//描边

		/*划横线*/
		context.moveTo(15,15+i*30);
		context.lineTo(435,15+i*30);
		context.stroke();
	}
}

//画棋子
var oneStep=function(i,j,me){
	context.beginPath();
	context.arc(15+i*30,15+j*30,13,0,2*Math.PI);//第一参数是圆心的坐标(15+i*30,15+j*30)，第二个是圆的半径(13),第三个是起始弧度和终止弧度(2*Math.PI)
	context.closePath();
	var gradient=context.createRadialGradient(15+i*30+2,15+j*30-2,  13 ,15+i*30+2,15+j*30-2,0);// createRadiaGradient 参数是两个圆(圆心点,半径)
     if(me){
	    gradient.addColorStop(0,'#0A0A0A');
	    gradient.addColorStop(1,'#636766');
    }else{
    	gradient.addColorStop(0,'#D1D1D1');
	    gradient.addColorStop(1,'#F9F9F9');
    }
	context.fillStyle=gradient;
	context.fill();//填充
}

drawChessBoard();

chess.onclick=function(e){
     if(over){
		 return;
	 }
	 if(!me){
		 return;
	 }
	var x=e.offsetX;
	var y=e.offsetY; 
	var i=Math.floor(x / 30);
    var j=Math.floor(y / 30);
    if(chessBoard[i][j]==0){
	    oneStep(i,j,me);
	    chessBoard[i][j]=1


		for(var k=0; k < count;k++){
          if(wins[i][j][k]){
			  myWin[k]++;
			  computerWin[k]=6;
			  if(myWin[k]==5){
				  window.alert('你赢了！');
				  over=true;
			  }
		  }
		}
		if(!over){
			me= !me;
           computerAI();
		}
    }
}

var computerAI=function(){
  var myScore=[];
  var computerScore=[];
  var max=0;//最高的分数
  //最高分点的坐标
  var u=0;
  var v=0;
  for(var i=0;i<15;i++){
	  myScore[i]=[];
	  computerScore[i]=[];
	  for(var j=0;j<15;j++){
		myScore[i][j]=0;
		computerScore[i][j]=0;
	  }
  }

  //遍历正棋盘
  for(var i=0;i<15;i++){
    for(var j=0;j<15;j++){
		if(chessBoard[i][j]==0){
			for(var k=0;k<count;k++){
				if(wins[i][j][k]){
					//我的
					if(myWin[k]==1){
						myScore[i][j]+=200
					}else if(myWin[k]==2){
						myScore[i][j]+=400
					}else if(myWin[k]==3){
						myScore[i][j]+=2000
					}else if(myWin[k]==4){
						myScore[i][j]+=10000
					}else if(myWin[k]==5){
						myScore[i][j]+=21000
					}
					//计算机
					if(computerWin[k]==1){
						computerScore[i][j]+=220
					}else if(computerWin[k]==2){
						computerScore[i][j]+=420
					}else if(computerWin[k]==3){
						computerScore[i][j]+=2100
					}else if(computerWin[k]==4){
						computerScore[i][j]+=20000
					} if(computerWin[k]==5){
						computerScore[i][j]+=60000
					}
				}
			}

			//我的
			if(myScore[i][j]>max){
				max=myScore[i][j];
				u=i;
				v=j;
			}else if(myScore[i][j]==max){
               if(computerScore[i][j]>computerScore[u][v]){
				   u=i;
				   v=j;
			   }
			}

            //电脑
			if(computerScore[i][j]>max){
				max=computerScore[i][j];
				u=i;
				v=j;
			}else if(computerScore[i][j]==max){
               if(myScore[i][j]>myScore[u][v]){
				   u=i;
				   v=j;
			   }
			}
		}
	}
  }

  oneStep(u,v,false)

  chessBoard[u][v]=2;//计算机在这个地方落了一个子
  for(var k=0; k < count;k++){
	if(wins[u][v][k]){
		computerWin[k]++;
		myScore[k]=6;
		if(computerWin[k]==5){
			window.alert('计算机赢了！');
			over=true;
		}
	}
  }
  
  if(!over){
	  me= !me; 
  }
}