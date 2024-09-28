const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const { readFile } = require('fs').promises;

const uri = 'mongodb+srv://tqanhtkqn:L2EEhNhOaXz7ufEn@qta.jpirv.mongodb.net/?retryWrites=true&w=majority&appName=QTA';
const client = new MongoClient(uri);

let db;

async function initializeDatabase() {
  try {
    await client.connect();
    db = client.db('chatbot'); 
    console.log('Connected to MongoDB');

    // Check if the questions collection already exists
    const collections = await db.listCollections({ name: 'questions' }).toArray();
    if (collections.length === 0) {
      // Initialize the database
      const questionsCollection = db.collection('questions');

      await questionsCollection.insertMany([
        { num: 1, content: "Bạn có thể cho biết tên đầy đủ của bạn không?" },
        { num: 2, content: "Bạn bao nhiêu tuổi?" },
        { num: 3, content: "Bạn có thể cho biết giới tính của mình không?" },
        { num: 4, content: "Bạn có thể cho số điện thoại hoặc email của bạn không?" },
        { num: 5, content: "Hiện tại bạn đang gặp phải những triệu chứng gì?" },
        { num: 6, content: "Các triệu chứng này bắt đầu từ khi nào?" },
        { num: 7, content: "Các triệu chứng này kéo dài bao lâu rồi?" },
        { num: 8, content: "Bạn có thể mô tả cảm giác của triệu chứng như thế nào không (ví dụ: đau nhói, âm ỉ, đập thình thịch)?" },
        { num: 9, content: "Đau ở vị trí nào?" },
        { num: 10, content: "Cơn đau có lan ra hay di chuyển đến các bộ phận khác của cơ thể không?" },
        { num: 11, content: "Điều gì khiến triệu chứng trở nên tốt hơn hay tệ hơn?" },
        { num: 12, content: "Bạn đánh giá mức độ đau của mình trên thang điểm từ 1 đến 10 như thế nào?" },
        { num: 13, content: "Các triệu chứng xuất hiện vào thời gian nào trong ngày hay liên tục?" },
        { num: 14, content: "Bạn có mắc phải bệnh mạn tính nào như tiểu đường, cao huyết áp hay hen suyễn không?" },
        { num: 15, content: "Bạn đã từng phẫu thuật lần nào trước đây chưa?" },
        { num: 16, content: "Hiện tại bạn có đang điều trị y tế nào không?" },
        { num: 17, content: "Bạn đã từng được chẩn đoán với tình trạng tương tự chưa?" },
        { num: 18, content: "Hiện tại bạn có đang dùng thuốc hay thực phẩm bổ sung nào không?" },
        { num: 19, content: "Bạn có thể liệt kê các loại thuốc bạn đang dùng và liều lượng không?" },
        { num: 20, content: "Bạn có gặp phản ứng phụ nào từ thuốc đang dùng không?" },
        { num: 21, content: "Bạn có dị ứng với loại thuốc nào không?" },
        { num: 22, content: "Gia đình bạn có ai mắc bệnh mạn tính như ung thư, bệnh tim hay tiểu đường không?" },
        { num: 23, content: "Trong gia đình có ai từng có triệu chứng tương tự không?" },
        { num: 24, content: "Lịch sử bệnh lý gia đình bạn về các bệnh di truyền như thế nào?" },
        { num: 25, content: "Bạn có hút thuốc hay sử dụng sản phẩm từ thuốc lá không?" },
        { num: 26, content: "Bạn uống rượu bia với tần suất như thế nào?" },
        { num: 27, content: "Bạn có bị sụt cân hay tăng cân gần đây không?" },
        { num: 28, content: "Bạn có khó thở hay đau ngực không?" },
        { num: 29, content: "Bạn có nhận thấy thay đổi nào trong thói quen đi tiêu hay tiểu tiện không?" },
        { num: 30, content: "Bạn có dị ứng với thực phẩm, thuốc hay yếu tố môi trường nào không?" },
        { num: 31, content: "Bạn đã từng gặp phản ứng như thế nào với các chất gây dị ứng?" },
        { num: 32, content: "Bạn có thể cung cấp hình ảnh các toa thuốc hoặc các tài liệu y tế của bạn không?" },
        { num: 33, content: "Bạn có bất kỳ kết quả xét nghiệm nào gần đây mà bạn có thể chia sẻ không?" }
      ]);
    } else {
      console.log('Questions collection already exists');
    }

    const question = await db.collection('questions').findOne({ num: 1 });
    console.log(question);

    const responsesCollection = db.collection('responses');
    if (responsesCollection.length === 0) {
      await responsesCollection.insertOne({ query: 'hello', response: 'Hi there!' });
      console.log('Created index on responses collection');
    }
    else {
      console.log('Responses collection already exists');
    }

  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  } finally {
    await client.close();
  }
}

initializeDatabase();

app.use(express.static('public'));
app.use(express.json());

app.get('/', async (req, res) => {
  res.send(await readFile('public/home.html', 'utf8'));
});

app.get('/chatbot', async (req, res) => {
  const {step } = req.query;
  let response = '';
  console.log(step);

  try {
    await client.connect();
    const collection = db.collection('questions');
    if (step <= 33) {
    const question = await collection.findOne({ num: parseInt(step) });
    console.log(question);
      response = question.content;
    } else if (step === '34') {
      response = "Cảm ơn bạn đã cung cấp thông tin! Xin hãy chờ trong giây lát...";
    }
    else {
      response = "xin chờ trong giây lát...";
    }
    res.json({ response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ response: "An error occurred okay"});
  } finally {
    await client.close();
  }
});

app.post('/saveUserInfo', async (req, res) => {
  const userInfo = req.body;
  console.log(userInfo);

  try {
    await client.connect();
    const collection = db.collection('userInfo');
    const result = await collection.insertOne(userInfo);
    console.log('User info saved:', result);
    res.status(200).json({ message: 'User info saved successfully' });
  } catch (err) {
    console.error('Error saving user info:', err);
    res.status(500).json({ message: 'An error occurred while saving user info' });
  }
});

app.listen(process.env.PORT || 3000, () => 
  console.log(`App available on http://localhost:3000`)
);