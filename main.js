window.onload = (event) => {
   let history = [];
   let textList;
   let showText;
   let input;
   let ctx;
   let count;
   let idx;

   //------------
   function timers() {
      let time = 3600;
      let min = "";

      let showTime = document.querySelector('#remaining');
      let times = setInterval(function () {
         min = Math.floor(Number(time / 60));

         showTime.innerText = `${min}`;
         let mins = (min <= 5);
         showTime.style.color = mins ? 'red' : '';
         time--
         if (time < 0) {
            clearInterval(times);
            showTime.innerHTML = '시간 초과';
            showTime.style.fontSize = '20px'
            게임종료()
         }
      }, 20);

   }


   function 초기화() {
      showText = document.querySelector('#show-text');
      showText.addEventListener('selectstart', (event) => {
         event.preventDefault();
      }); // 드래그 방지
      input = document.querySelector('#input-typing');
      ctx = document.querySelector('.ctx');
      count = 0;
      timers()
      무작위다음단계로넘기();
      앱의메인로직();
   };


   function 무작위다음단계로넘기() {
      if (textList.length > history.length) {
         while (true) {
            idx = Math.round(Math.random() * (textList.length - 1));
            if (!history.includes(idx)) {
               break;
            } else {
            }
         }
         history.push(idx);
         showText.textContent = textList[idx];
      }
   }
   function 입력박스가비어있지않는가() {
      return input.value !== '';
   }
   function 맞힌갯수에숫자올리기() {
      count++;
      ctx.textContent = count; // 맞힌 갯수 표시
   }
   function 맞춘갯수가전체목록수보다작은가() {
      return count < textList.length - 1;
   }
   function 입력한것같은지확인() {
      return showText.textContent === input.value;
   }
   function 게임끝나면텍스트보이기(input) {
      const hd = document.createElement('h1');
      hd.id = 'gameOverMessege';
      const escText = document.createElement('span');
      escText.className = 'esc-text';

      showText.appendChild(hd);
      showText.appendChild(escText)
      showText.style.top = '38%';
      showText.style.left = '50%';
      showText.innerHTML = `
            <h1 id="gameOverMessege">GAME OVER</h1>
            <span class="esc-txt">다시 하려면 클릭해주세요!</span>`;
      showText.style.cursor = 'pointer';
      showText.style.position = 'absolute';
      //  showText.style.top = '50%';
      //  showText.style.left = '50%';
      showText.style.transform = 'translate(-50%, -50%)';
      showText.style.color = 'red';
      input.value = '';
      input.disabled = true;

      showText.addEventListener('click', () => {
         window.location.reload(true);
      });

   }
   function 게임종료() {
      게임끝나면텍스트보이기(input)
   }
   function 틀렸을때() {
      console.log('다시 해봐!!');
   }
   function 앱의메인로직() {
      input.addEventListener('keyup', (e) => {

         am.grant_permission(); // 최초1회실행
         am.play('voic', {
            start: function (task) {
               console.log('재생이 시작되었습니다');
            },
            end: function (task) {
               console.log('재생이 종료되었습니다');
            }
         });


         let 엔터를눌렀는가 = (e.keyCode === 13);
         let 타이핑값이같은가 = textList[idx].indexOf(input.value) === 0
         if (타이핑값이같은가) {
            let str = `<strong id='st'>${input.value}</strong>${textList[idx].substring(input.value.length, textList[idx].length)}`;
            showText.innerHTML = str;
         } else {
            showText.textContent = textList[idx];
         }
         if (!엔터를눌렀는가) { return; }
         if (!입력박스가비어있지않는가()) { return; }
         if (맞춘갯수가전체목록수보다작은가()) {
            if (입력한것같은지확인()) {
               무작위다음단계로넘기();
               맞힌갯수에숫자올리기();
            } else {
               틀렸을때();
            }
         } else {
            게임종료();

         }
         input.value = '';
      });
   }

   // 게임 음원 불러오기
   let am;
   $.get('./audio.json', audio_data => {
      am = new AudioManager(audio_data, function (err) {
         if (!err) {
            console.log('모든 음원리소스 로드 완료');
            폰트로드하고초기화();
         } else {
            console.log('다음 건들에 대해서 로드 실패');
         }
      });
   });

   function 폰트로드하고초기화() {
      (async () => {
         try {
            // font_loader will raise exception on even 1 thing fail. if not returns true
            await font_loader([
               { name: 'NEXON Lv1 Gothic OTF Light', path: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/NEXON%20Lv1%20Gothic%20OTF%20Light.woff' },
               { name: 'GongGothicMedium', path: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10@bd5e3f271dde160c10fde61328f5ed320e45d490/GongGothicMedium.woff' },
            ], font_name => {
               console.log(font_name + ' loading complete');
               (async function () {
                  let res = await fetch('./list.json'); //통신 >> 통신완료후 res === 통신의 결과, 
                  let rr = await res.json(); //통신된 결과로 json(), text() 이렇게 얻고 싶은 형태로 가져옴  
                  textList = rr.list;
                  document.querySelector('#container').style.opacity = 1;
                  초기화();
               })()
            });
         } catch (e) {
            console.log(e);
            console.log('Fails to load fonts. It is sad.');
         }
      })();
   }

















};
