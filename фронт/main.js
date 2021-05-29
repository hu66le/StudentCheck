function show(argument) {

	let group = {
	 	group_1: ["Горбатков Артем", "Калмыков Азамат"],
	 	group_2: ["Куликов Георгий", "Скворцова Евгения"],
	 	group_3: ["Иванов Петя", "Скляров Антон"],
	 	group_4: ["Куликов Геннадий", "Воскресенская Ольга"],
	 	group_5: ["Горбатков Артем", "Калмыков Азамат"],

	 	group_6: ["Горбатков Артем", "Калмыков Азамат"],
	 	group_7: ["Горбатков Артем", "Калмыков Азамат"],
	 	group_8: ["Горбатков Артем", "Калмыков Азамат"],
	 	group_9: ["Горбатков Артем", "Калмыков Азамат"],
	 	group_10: ["Горбатков Артем", "Калмыков Азамат"],
};
	let out = group.group_9; 
		out = out.join(`\n`);

	if (out) {
		document.getElementById('list_of_students').innerHTML = out;
		
		// document.getElementById('groups').innerHTML = '';
	}

	else{
		alert('Никого из группы нет!');
	} 
}