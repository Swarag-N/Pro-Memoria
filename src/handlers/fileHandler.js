module.exports = async function fileUpload(ctx) {
  try {
    let msg = '';
    const fileData = ctx.update.message.document;

    if (fileData.mime_type == 'application/json') {
      console.log(fileData.mime_type);

      const { href } = await ctx.telegram.getFileLink(fileData.file_id);
      const response = await axios.get(href);

      if (response.status === 200 || statusText === 'OK') {
        const data = JSON.stringify(response.data);
        // TODO: Update data once user resubmits data
        // msg = "You'r Previous Data is Replaced with this DATA"
        // let filePath = path.join(__dirname,'../', "data/users", ctx.from.id + ".json")
        // if (!fs.existsSync(filePath)) {
        msg = "You'r Data is Added";
        // }
        const subjs = JSON.parse(data);
        const slots_added = [];
        subjs.forEach(async (subj) => {
          const temp_slot = await addSubject(subj, ctx.from.id);
          console.log(temp_slot);
          slots_added.push(...temp_slot);
        });
        console.log(slots_added, '******************');
      }
      // fs.writeFileSync(filePath, data)
    } else if (fileData.mime_type == 'text/html') {
      // TODO: Parse HTML and Make JSON
      msg = 'Adding Func to Parse HTMl ';
    } else {
      msg = 'In Valid File Type';
    }

    ctx.reply(msg);
  } catch (error) {
    if (error instanceof ReferenceError) {
      ctx.reply(error.message);
    } else {
      console.log(error);
      ctx.reply('There is a Server error please \n Try again later');
    }
  }
};
