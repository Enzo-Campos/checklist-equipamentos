const PDFDocument = require('pdfkit');

// RF08: checklist imprimível com campo de assinatura (assinada fisicamente à mão)
function gerarPdfComanda(comanda, stream) {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(stream);

  doc.fontSize(18).text('Checklist de Equipamentos', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12);
  doc.text(`Comanda #${comanda.id}`);
  doc.text(`Cliente: ${comanda.cliente_nome}`);
  doc.text(`Responsável: ${comanda.funcionario_nome}`);
  doc.text(`Data: ${new Date(comanda.created_at).toLocaleDateString('pt-BR')}`);
  doc.moveDown();

  doc.fontSize(14).text('Itens:');
  doc.moveDown(0.5);
  doc.fontSize(12);
  comanda.itens.forEach((item, i) => {
    doc.text(`${i + 1}. ${item.nome}`);
  });

  doc.moveDown(3);
  doc.text('Assinatura: ____________________________________________');

  doc.end();
}

module.exports = { gerarPdfComanda };
