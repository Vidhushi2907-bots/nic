
class productiohelper {
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
    static removeTwoDuplicates(arr) {
        const uniqueObjects = {};

        arr.forEach(obj => {
            const uniqueKey = obj['id'] ;

            if (!uniqueObjects.hasOwnProperty(uniqueKey)) {
                uniqueObjects[uniqueKey] = obj;
            }
        });

        return Object.values(uniqueObjects);
    }
    
    static sumofDuplicateData(indentordata){
        const uniqueIndentorDataMap = []
        for (const item of indentordata) {
          let keys = ['id']
          const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

          if (!uniqueIndentorDataMap[key]) {
            uniqueIndentorDataMap[key] = { ...item }; // Copy the object
          } else {
            uniqueIndentorDataMap[key].allocate_qnt += item.allocate_qnt; // Calculate the sum based on the "value" property
          }
        }
        const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
        return uniqueJsonArrays
    }
    static sumofDuplicateDataSecond(indentordata,key1,values){
        const uniqueIndentorDataMap = []
        for (const item of indentordata) {
          let keys = [key1]
          const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

          if (!uniqueIndentorDataMap[key]) {
            uniqueIndentorDataMap[key] = { ...item }; // Copy the object
          } else {
            uniqueIndentorDataMap[key].lot_number_size += item.lot_number_size; // Calculate the sum based on the "value" property
          }
        }
        const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
        return uniqueJsonArrays
    }
    static sumofDuplicateDataSecondmulitple(indentordata,key1){
        const uniqueIndentorDataMap = []
        for (const item of indentordata) {
          let keys = [key1]
          const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

          if (!uniqueIndentorDataMap[key]) {
            uniqueIndentorDataMap[key] = { ...item }; // Copy the object
          } else {
            uniqueIndentorDataMap[key].allocate_qnt += item.allocate_qnt; // Calculate the sum based on the "value" property
          }
        }
        const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
        return uniqueJsonArrays
    }
    static sumofDuplicateDataSecondmulitplelifted(indentordata,key1){
        const uniqueIndentorDataMap = []
        for (const item of indentordata) {
            
            item.lifting = parseFloat(item.lifting)
          let keys = [key1]
          const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

          if (!uniqueIndentorDataMap[key]) {
            uniqueIndentorDataMap[key] = { ...item }; // Copy the object
          } else {
            uniqueIndentorDataMap[key].lifting += item.lifting; // Calculate the sum based on the "value" property
          }
        }
        const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
        return uniqueJsonArrays
    }
     static sumofDuplicateDataSecondIndentQty(indentordata,key1){
        const uniqueIndentorDataMap = []
        for (const item of indentordata) {
          let keys = [key1]
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
    
    static sumofDuplicateDataSecondIndentliftiedQty(indentordata,key1){
        const uniqueIndentorDataMap = []
        for (const item of indentordata) {
          
          let keys = [key1]
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
    static calculateSumOfDuplicates(arr, key) {
        const sumMap = new Map();
      
        // Iterate through the array and calculate the sum for each duplicate key
        for (const obj of arr) {
          const keyValue = obj[key];
      
          if (!sumMap.has(keyValue)) {
            sumMap.set(keyValue, obj.allocate_qnt);
          } else {
            sumMap.set(keyValue, sumMap.get(keyValue) + obj.allocate_qnt);
          }
        }
      
        const arrs=[]
        // Print the sum for each duplicate key
        sumMap.forEach((value, keyValue) => {
            arrs.push({id:keyValue,'allocated':value})

        //   console.log(`Sum of ${keyValue}: ${value}`);
        });
        return arrs
      }
      static calculateSumOfDuplicatesIndentQty (arr, key) {
        const sumMap = new Map();
      
        // Iterate through the array and calculate the sum for each duplicate key
        for (const obj of arr) {
          console.log(arr,'arrarr')
          const keyValue = obj[key];
      
          if (!sumMap.has(keyValue)) {
            sumMap.set(keyValue, obj.indent_quantity);
          } else {
            sumMap.set(keyValue, sumMap.get(keyValue) + obj.indent_quantity);
          }
        }
      
        const arrs=[]
        // Print the sum for each duplicate key
        sumMap.forEach((value, keyValue) => {
            arrs.push({id:keyValue,'indent':value})

        //   console.log(`Sum of ${keyValue}: ${value}`);
        });
        return arrs
      }
      static calculateSumOfDuplicatesIndentQtySecond (arr, key1) {
        const uniqueIndentorDataMap = []
        for (const item of arr) {
          
          let keys = [key1]
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
      static calculateSumOfDuplicatesAllocatedQtySecond (arr, key1) {
        const uniqueIndentorDataMap = []
        for (const item of arr) {
          
          let keys = [key1]
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
      
      static calculateSumOfDupliccatesAllocatedQtySecond(indentordata,key1){
        const uniqueIndentorDataMap = []
        for (const item of indentordata) {
          let keys = [key1]
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
    static calculateSumOfDupliccatesAvailableQtySecond(indentordata,key1,key2,key3){
      const uniqueIndentorDataMap = []
      for (const item of indentordata) {
        let keys = [key1,key2,key3]
        const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

        if (!uniqueIndentorDataMap[key]) {
          uniqueIndentorDataMap[key] = { ...item }; // Copy the object
        } else {
          uniqueIndentorDataMap[key].quantity += item.quantity; // Calculate the sum based on the "value" property
        }
      }
      const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
      
      return uniqueJsonArrays
  }
static removeDuplicateswithtwo(data, key1, key2, key3) {
  const seen = new Set();
  return data.filter(item => {
    const keyValue = `${item[key1]}|${item[key2]}|${item[key3]}`;
    if (seen.has(keyValue)) {
      return false;
    } else {
      seen.add(keyValue);
      return true;
    }
  });
}
static removeDuplicateswiththree(data, key1, key2, key3) {
  const seen = new Set();
  return data.filter(item => {
    const keyValue = `${item[key1]}|${item[key2]}|${item[key3]}`;
    if (seen.has(keyValue)) {
      return false;
    } else {
      seen.add(keyValue);
      return true;
    }
  });
}
}
module.exports=productiohelper