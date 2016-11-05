//Пример связки таблицы в Тильде (id) и таблицы в GoogleSpreadsheets (url). Строка запроса (req) определяет какие данные нужны.
//Если нужно несколько таблиц, то нужно добавить несколько записей в массив.
//var prms = [];
//prms.push({
//	id : '12345678',
//	url: 'https://docs.google.com/spreadsheets/d/1OXpfdnvu8_vgvIyxKOVHFWGCEmNxTBC9sgqkmA6fWlw/edit?usp=sharing',
//	req: 'select B, D, E, F, G where A="ЖК Пермские высоты"'
//});
var curBlock = 0; //для последовательного заполнения нескольких таблиц.
var google = {visualization: {Query: {setResponse: function(){}}}} //callback функция для получения ответа от google spreadsheets

// сохраняем ссылку на старую функцию
var oldF = t431_createTable;
var styles = {};

//фунция получения параметров таблицы: стилей и ширины столбцов
t431_createTable = function (
  id,
  t431__tablehead,
  t431__tablebody,
  per,
  w,
  t431__btnstyles,
  t431__tdstyles,
  t431__thstyles,
  t431__oddrowstyles,
  t431__evenrowstyles
){
	// сохраняем переданные стили 
	styles['rec'+id] = {
		t431__tablehead: t431__tablehead,
		t431__tablebody: t431__tablebody,
		per: per,
		w: w,
		t431__btnstyles: t431__btnstyles,
		t431__tdstyles: t431__tdstyles,
		t431__thstyles: t431__thstyles,
		t431__oddrowstyles: t431__oddrowstyles,
		t431__evenrowstyles: t431__evenrowstyles,
	};

	// вызываем старую функцию
	oldF(id,
	t431__tablehead,
	t431__tablebody,
	per,
	w,
	t431__btnstyles,
	t431__tdstyles,
	t431__thstyles,
	t431__oddrowstyles,
	t431__evenrowstyles);
}

function gss4tilda_createT431 (blockID, data)
{
	//Заполняем заголовки таблицы
	var part1="";
	for(var i=0; i<data.table.cols.length; i++)
	{
		part1 += htmlentities(data.table.cols[i].label) + ';';
	}
	part1 = part1.slice(0,-1);
	
	//Заполняем данные таблицы
	var part2="";
	var empty = true;
	for(var i=0; i<data.table.rows.length; i++)
	{
		empty = true;
		for(var j=0; j<data.table.rows[i].c.length; j++)
		{			
			if(data.table.rows[i].c[j] !== null && typeof data.table.rows[i].c[j] === 'object' && data.table.rows[i].c[j].v !== null && data.table.rows[i].c[j].v !== '')
			{
				part2 += htmlentities(data.table.rows[i].c[j].v) + ';'
				empty = false;
			}
			else
			{
				part2 += ';'
			};
			
		}
		
		part2 = !empty ? part2.slice(0,-1) + "\n" : part2.slice(0,- data.table.rows[i].c.length);
		//part2 += "\n";
	}
	part2 = part2.slice(0,-1);

	//Очищаем блок от старых данных
	$('#rec' + blockID + " table").html("");
	
	//вызываем функцию формирования для таблицы	
	t431_createTable(blockID, part1, part2, styles['rec'+blockID].per, styles['rec'+blockID].w, styles['rec'+blockID].t431__btnstyles, styles['rec'+blockID].t431__tdstyles, styles['rec'+blockID].t431__thstyles, styles['rec'+blockID].t431__oddrowstyles, styles['rec'+blockID].t431__evenrowstyles);

	//подгоняем ширину столбцов
	if('' && $('#rec'+ blockID +' .t431 .t-container .t431__data-part2').html().length>0) {
		setTimeout(function(){ t431_setHeadWidth(prms[curBlock].id); }, 200);
	}	
}

function gss4tilda_createT273 (blockID, data)
{
	//контейнер ответов
	var faqContainer = $("#rec"+blockID + " .t-col:first");
	//первый элемент который будем клонировать
	var faqElement = $("#rec"+blockID + " .t273__wrapper:first");
	
	//Заполняем блок вопросов и ответов
	for(var i=0; i<data.table.rows.length; i++)
	{
		
		/*for(var j=0; j<data.table.rows[i].c.length; j++)
		{			
			if(data.table.rows[i].c[j] !== null && typeof data.table.rows[i].c[j] === 'object' && data.table.rows[i].c[j].v !== null && data.table.rows[i].c[j].v !== '')
			{
				part2 += htmlentities(data.table.rows[i].c[j].v) + ';'
				empty = false;
			}
			else
			{
				part2 += ';'
			};
			
		}*/
		if ( data.table.rows[i].c[0] !== null && typeof data.table.rows[i].c[0] === 'object' && data.table.rows[i].c[0].v !== null && data.table.rows[i].c[0].v !== ''
		  && data.table.rows[i].c[1] !== null && typeof data.table.rows[i].c[1] === 'object' && data.table.rows[i].c[1].v !== null && data.table.rows[i].c[1].v !== '' 
		  && data.table.rows[i].c[2] !== null && typeof data.table.rows[i].c[2] === 'object' && data.table.rows[i].c[2].v !== null && data.table.rows[i].c[2].v !== ''
		  && data.table.rows[i].c[3] !== null && typeof data.table.rows[i].c[3] === 'object' && data.table.rows[i].c[3].v !== null && data.table.rows[i].c[3].v !== ''
		)
		{
			//Копируем блок с вопросом и ответом
			faqCurElement = i==0 ? faqElement : $(faqElement).clone().appendTo(faqContainer);
			//Меняем содержимое
			//Имя спрашивающего
			$(faqCurElement).find(".t273__question-name:first").html( htmlentities(data.table.rows[i].c[0].v) + ":" );
			//Вопрос
			$(faqCurElement).find(".t273__question-text:first").html( htmlentities(data.table.rows[i].c[1].v) );
			//Имя отвечающего
			$(faqCurElement).find(".t273__answer-name:first").html( htmlentities(data.table.rows[i].c[2].v) + ":" );
			//Ответ
			$(faqCurElement).find(".t273__answer-text:first").html( htmlentities(data.table.rows[i].c[3].v) );
		}
	}
}

//Callback функция для полуения данных от google в формате jsonp
google.visualization.Query.setResponse = function(data)
{
	//Получаем ссылку на нужный блок
	var blockID = prms[curBlock].id;
	var blockType = $("#rec"+blockID + " div:first").attr("class");

	switch (blockType) {
		case 't431' :
			//table
			gss4tilda_createT431(blockID, data);
			break;
		case 't273' :
			//faq
			gss4tilda_createT273(blockID, data);
			break;
	}

	
	//Переходим к следующему блоку или сбрасываем счетчик
	if (curBlock < prms.length-1)
	{
		curBlock++;
		getGssData();
	}
	else
	{
		curBlock = 0;
	}
}

//функция запроса данных от google spreadsheets
function getGssData()
{
	//Проверяем наличие всех необходимых данных
	if ("id" in prms[curBlock] && "url" in prms[curBlock] && "req" in prms[curBlock])
	{
		//Если вместо id таблицы стоит 0, то берем таблицу из предыдущего блока
		if(prms[curBlock].id==='0')
		{
			$("script[src]").each(function(){
				if(~this.src.indexOf("gss4tilda_table.js"))
					prms[curBlock].id = $(this).parents('.r').prev().attr('id').substr(3);
			});
		}
		//TODO: Добавить проверку на наличие rec в начале ID и удаление
		//получаем код таблицы из url и отправляем запрос на получение данных
		var gssCode = prms[curBlock]["url"].slice( prms[curBlock]["url"].indexOf("spreadsheets/d/") + 15, prms[curBlock]["url"].indexOf("/edit?"));
		$.ajax({
			url: 'https://docs.google.com/a/google.com/spreadsheets/d/' + gssCode + '/gviz/tq?tq=' + encodeURIComponent( prms[curBlock].req ), 
			dataType : 'jsonp'
		});
	}
}

function htmlentities(s){	// Convert all applicable characters to HTML entities
	// 
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)

	var div = document.createElement('div');
	var text = document.createTextNode(s);
	div.appendChild(text);
	return div.innerHTML;
}

$().ready(function(){
	//сбрасываем счетчик таблиц и получаем первую таблицу
	curBlock = 0;
	getGssData();
})
