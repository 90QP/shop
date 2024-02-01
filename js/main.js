const items = document.querySelector('.items') //ul
const input = document.querySelector('.footer_input')
const addBtn = document.querySelector('.footerAdd_btn')

//입력한 내용을 로컬 스토리지(json파일 형식:key,value으로 저장됨)에 저장
let shoppingList = [] //입력한 내용들을 담을 array 생성

//localStorage에 array를 저장
const save = () => {
  localStorage.setItem('shoppingList',JSON.stringify(shoppingList)) //js를 JSON 형식으로 전환
}

const onAdd = () => {
  // 1. 사용자가 입력한 텍스트를 받아옴

  const product = {
    text : input.value,
    id : Date.now() //id값을 1, 2, 3, 4가 아닌 UCT시간부터 현재까지 몇초(ms)지났는지를 사용
  }

  if(product.text.trim() == ''){ //trim('')비어 있는 부분을 제외하고 검사
    //텍스트 창이 비어있을 때 아무 값도 출력x
    input.value='';
    input.focus()
    return 
  }

  //배열에 아이템 저장
  shoppingList.push(product)
  save(); //로컬스토리지에 저장하는 함수 실행 

  // 2. 새로운 아이템(li/텍스트,삭제버튼)를 만듦
  const item = creatItem(product)

  // 4. 인풋 입력창 초기화
  input.value='';
  input.focus()
}

//입력 후 아이템(li)를 만들어 주는 함수.
function creatItem(product){ //onAdd의 text를 받아옴
  const itemRow = document.createElement('li') //li 생성
  itemRow.setAttribute('class','item_row') //클래스 부여
  itemRow.setAttribute('data-id', product.id) //dataset부여 -> delete Button에 사용

  itemRow.innerHTML = `
  <div class="item">
    <span class="item_name">${product.text}</span>
    <button class="itemDel_btn">
      <i class="fa-solid fa-trash-can" data-id="${product.id}"></i>
    </button>
  </div>
  `
  
  // 3. items(ul)에 2에서 만든 li를 추가
  items.append(itemRow)
  itemRow.scrollIntoView({ //새로 추가된 li로 자동 스크롤
    block:"start",
    behavior:"smooth"
  });

  return itemRow; //최종적으로 만든 ul(items)를 리턴해줌
}

// 초기화 해주는 함수 (스토리지에 저장된 것 반영)
const init = () => {
  const userShoppingList = JSON.parse(localStorage.getItem('shoppingList'));
  if(userShoppingList){//로컬스토리지에 저장된 값이 있을경우에만 실행
    userShoppingList.forEach((element)=>creatItem(element))
    shoppingList = userShoppingList
  }

}
init(); //화면 로딩되자마자 실행

addBtn.addEventListener('click', () => { 
  onAdd() 
});

//input에서 엔터를 쳤을 때도 입력이 되게
input.addEventListener('keypress', (e)=>{
  e.key === 'Enter' && onAdd();
  //둘 다 true일 때 뒤의 함수를 실행.
})

//이벤트 위임을 이용한 삭제 : li가 생성될때마다 고유한 key값(data-set)을 생성 -> delBtn을 누르면 해당 key값의 내용을 삭제
items.addEventListener('click', (e)=>{
  //console.log(e.target.dataset.id) -> del아이콘을 누르는 순간 data-set의 id를 인식
  const delId = e.target.dataset.id
  console.log(delId)

  if(delId){ // data-set : id가 있을때
    document.querySelector(`.item_row[data-id="${delId}"]`).remove();
    //내가 클릭한 data-set과 같은 li를 찾음

    shoppingList = shoppingList.filter((aa)=> aa.id !== parseInt(delId) );
    save();
  }
})
