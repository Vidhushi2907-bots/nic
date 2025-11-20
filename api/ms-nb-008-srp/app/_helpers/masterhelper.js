class masterHelper{
    static removeDuplicates(array, key) {
        const uniqueValues = new Set();
        return array.filter(obj => {
            if (!uniqueValues.has(obj[key])) {
                uniqueValues.add(obj[key]);
                return true;
            }
            return false;
        });
    }
    static removeThreeDuplicates(arr, key1, key2,key3) {
        const uniqueObjects = {};

        arr.forEach(obj => {
            const uniqueKey = obj[key1] + '|' + obj[key2] + '|' + obj[key3];

            if (!uniqueObjects.hasOwnProperty(uniqueKey)) {
                uniqueObjects[uniqueKey] = obj;
            }
        });

        return Object.values(uniqueObjects);
    }
    static removetwoDuplicates(arr, key1, key2) {
      const uniqueObjects = {};

      arr.forEach(obj => {
          const uniqueKey = obj[key1] + '|' + obj[key2] ;

          if (!uniqueObjects.hasOwnProperty(uniqueKey)) {
              uniqueObjects[uniqueKey] = obj;
          }
      });

      return Object.values(uniqueObjects);
  }
    static processString(stringsArray){
      let extractedValues = [];
      let stringsArraySecond = []
      if (stringsArray.includes(',')) {
        let split = stringsArray.split(',');
        stringsArraySecond = (split);
        stringsArraySecond = stringsArraySecond.filter(Boolean);
        console.log(stringsArraySecond, 'stringsArraySecond')
      }
      else {
        stringsArraySecond.push(stringsArray)
      }
      stringsArraySecond.forEach((inputString, i) => {

        if (inputString.includes("~")) {
          let rangeParts = inputString.split("~");
          let prefix = rangeParts[0].replace(/~\d+$/, ''); // Extract prefix before numbers
          let start = parseInt(rangeParts[0].match(/\d+/)[0]);
          let end = parseInt(rangeParts[1]);
          // let startRange=
          let parts = rangeParts[0].split(/\D+/);

          // Get the last element which should be the number
          let first = parts[parts.length - 1];
          start = parseInt(first)
          let starting = start.toString().length
          let len = end - start
          prefix = prefix.slice(0, -starting)
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = start; i <= end; i++) {
              extractedValues.push({ 'tag': prefix + i, 'total_bag': len });
            }
          }
        } else {
          extractedValues.push({ tag: inputString, total_bag: 1 }); // Push the original value if no '~' found
        }
      });

      return extractedValues;
    }
    static removetwoDuplicates(arr, key1, key2) {
      const uniqueObjects = {};

      arr.forEach(obj => {
          const uniqueKey = obj[key1] + '|' + obj[key2] ;

          if (!uniqueObjects.hasOwnProperty(uniqueKey)) {
              uniqueObjects[uniqueKey] = obj;
          }
      });

      return Object.values(uniqueObjects);
  }
    static sumofDuplicates(arr, key1, key2,key3) {
        // console.log(arr,'production_center_wise_details_reportproduction_center_wise_details_report')
        // let 
        const uniqueIndentorDataMap = []
        let keys = [key1 ,key2, key3]
        for(let item of arr){            
            const key = keys.map(k=>item[k]).join('_');
            if (!uniqueIndentorDataMap[key]) {
                uniqueIndentorDataMap[key] = { ...item }; // Copy the object
              } else {
                uniqueIndentorDataMap[key].quantity += item.quantity; // Calculate the sum based on the "value" property
              }
        }      
            const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
            return uniqueJsonArrays

    }
    static sumofDuplicateData(indentordata){
        const uniqueIndentorDataMap = []
        for (const item of indentordata) {
          let keys = ['user_id']
          const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys
 
          if (!uniqueIndentorDataMap[key]) {
            uniqueIndentorDataMap[key] = { ...item }; // Copy the object
          } else {
            uniqueIndentorDataMap[key].quantity_of_seed_produced += item.quantity_of_seed_produced; // Calculate the sum based on the "value" property
          }
        }
        const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
        return uniqueJsonArrays
    }
    static sumofDuplicateDataIndenter(indentordata){
       const uniqueIndentorDataMap = []
       for (const item of indentordata) {
         let keys = ['user_id']
         const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

         if (!uniqueIndentorDataMap[key]) {
           uniqueIndentorDataMap[key] = { ...item }; // Copy the object
         } else {
           uniqueIndentorDataMap[key].lifting_quantity += item.lifting_quantity; // Calculate the sum based on the "value" property
         }
       }
       const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
       return uniqueJsonArrays
   }
     
   static sumofDuplicateDataAllocatedQty(indentordata){
    const uniqueIndentorDataMap = []
    for (const item of indentordata) {
      let keys = ['user_id']
      const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

      if (!uniqueIndentorDataMap[key]) {
        uniqueIndentorDataMap[key] = { ...item }; // Copy the object
      } else {
        uniqueIndentorDataMap[key].qty += item.qty; // Calculate the sum based on the "value" property
      }
    }
    const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
    return uniqueJsonArrays
}
static sumofDuplicateDataIndentDataQty(indentordata){
  const uniqueIndentorDataMap = []
  for (const item of indentordata) {
    let keys = ['crop_code','variety_id']
    const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

    if (!uniqueIndentorDataMap[key]) {
      uniqueIndentorDataMap[key] = { ...item }; // Copy the object
    } else {
      uniqueIndentorDataMap[key].indent_quantity += item.indent_quantity; // Calculate the sum based on the "value" property
    }
  }
  const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
  return uniqueJsonArrays
}
static sumofDuplicateDataAllocationQty(indentordata){
  const uniqueIndentorDataMap = []
  for (const item of indentordata) {
    let keys = ['crop_code','variety_id','user_id']
    const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

    if (!uniqueIndentorDataMap[key]) {
      uniqueIndentorDataMap[key] = { ...item }; // Copy the object
    } else {
      uniqueIndentorDataMap[key].lifting_quantity += item.lifting_quantity; // Calculate the sum based on the "value" property
    }
  }
  const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
  return uniqueJsonArrays
}
static sumofDuplicateDataAllottedty(indentordata,item1,item2){
  const uniqueIndentorDataMap = []
  for (const item of indentordata) {
    let keys = [item1,item2]
    const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

    if (!uniqueIndentorDataMap[key]) {
      uniqueIndentorDataMap[key] = { ...item }; // Copy the object
    } else {
      uniqueIndentorDataMap[key].qty += item.qty; // Calculate the sum based on the "value" property
    }
  }
  const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
  return uniqueJsonArrays
}
// static convertDates(inputFormat){
//   function pad(s) { return (s < 10) ? '0' + s : s; }
//   var d = new Date(inputFormat)
//   return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
//   // return uniqueJsonArrays
// }
static  convertDates(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat)
  return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
}
}

module.exports= masterHelper