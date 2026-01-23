// import { StaticFormModel } from '../domain/static.form.model';
// import { initialCurrencies, initialForms } from './seed.tasks';
// import { CurrencyModel } from '../domain/static.currency.model';
//
//
// export const autoSeedForms = async () => {
//   try {
//     // Используем bulkWrite для массовых операций
//     const operations = initialForms.map(form => ({
//       updateOne: {
//         filter: { type_id: form.type_id }, // Ищем по уникальному type_id
//         update: {
//           $set: { // Обновляем только необходимые поля
//             type: form.type,
//             type_title: form.type_title,
//             type_value: form.type_value,
//             values: form.values,
//           }
//         },
//         upsert: true // Создать если не существует
//       }
//     }));
//
//     const result = await StaticFormModel.bulkWrite(operations);
//
//     console.log('📊 Результат обновления форм:');
//     console.log(`   Найдено существующих: ${result.matchedCount}`);
//     console.log(`   Обновлено: ${result.modifiedCount}`);
//     console.log(`   Создано новых: ${result.upsertedCount}`);
//
//   } catch (error) {
//     console.error('❌ Ошибка при обновлении форм:', error);
//
//     // Если ошибка дублирования, проверьте данные
//     if (error.code === 11000) {
//       console.error('Возможные дубликаты type_id в initialForms');
//
//       // Проверьте initialForms на дубликаты type_id
//       const typeIds = initialForms.map(f => f.type_id);
//       const duplicates = typeIds.filter((id, index) => typeIds.indexOf(id) !== index);
//
//       if (duplicates.length > 0) {
//         console.error('Дубликаты type_id:', [...new Set(duplicates)]);
//       }
//     }
//   }
// };
//
// export const autoSeedCurrencies = async (): Promise<void> => {
//   try {
//     // Создаем операции для bulkWrite
//     const operations = initialCurrencies.map(currency => ({
//       updateOne: {
//         filter: { id: currency.id },
//         update: { $setOnInsert: currency }, // Только при вставке
//         upsert: true
//       }
//     }));
//
//     await CurrencyModel.bulkWrite(operations);
//     console.log(`✅ Валюты обновлены, обработано ${initialCurrencies.length} записей`);
//   } catch (error) {
//     console.error('❌ Ошибка при обновлении валют:', error);
//   }
// };
