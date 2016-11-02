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

//Callback функция для полуения данных от google в формате jsonp
google.visualization.Query.setResponse = function(data)
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
	for(var i=0; i<data.table.rows.length; i++)
	{
		for(var j=0; j<data.table.rows[i].c.length; j++)
		{
			part2 += data.table.rows[i].c[j] !== null && typeof data.table.rows[i].c[j] === 'object' ? htmlentities(data.table.rows[i].c[j].v) + ';' : ';';
		}
		part2 = part2.slice(0,-1);
		part2 += "\n";
	}
	part2 = part2.slice(0,-1);

	//вызываем функцию формирования для очередной таблицы
	var blockID = prms[curBlock].id;
	$('#rec' + blockID + " table").html("");
	t431_createTable(blockID, part1, part2, styles['rec'+blockID].per, styles['rec'+blockID].w, styles['rec'+blockID].t431__btnstyles, styles['rec'+blockID].t431__tdstyles, styles['rec'+blockID].t431__thstyles, styles['rec'+blockID].t431__oddrowstyles, styles['rec'+blockID].t431__evenrowstyles);

	//подгоняем ширину столбцов
	if('' && $('#rec'+ blockID +' .t431 .t-container .t431__data-part2').html().length>0) {
		setTimeout(function(){ t431_setHeadWidth(prms[curBlock].id); }, 200);
	}
	
	//Переходим к следующей таблице или сбрасываем счетчик
	if (curBlock < prms.length)
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
