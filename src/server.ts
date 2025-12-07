import app from "./app";
import { autoReturn } from "./jobs/autoReturn";


const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  setInterval(autoReturn, 3600000);
});
