import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { CartItem } from '@/context/CartContext';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#112233',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#AAAAAA',
    borderBottomWidth: 1,
    alignItems: 'center',
    minHeight: 30,
  },
  tableHeader: {
    backgroundColor: '#F0F0F0',
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  total: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#112233',
    paddingTop: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#AAAAAA',
    paddingTop: 10,
  },
});

interface InvoicePDFProps {
  items: CartItem[];
  totalAmount: number;
  invoiceNumber: string;
  date: string;
}

export default function InvoicePDF({ items, totalAmount, invoiceNumber, date }: InvoicePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>FACTURE</Text>
          <Text>Numéro de facture: {invoiceNumber}</Text>
          <Text>Date: {date}</Text>
        </View>

        <View style={styles.section}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Produit</Text>
            <Text style={styles.tableCell}>Prix unitaire</Text>
            <Text style={styles.tableCell}>Quantité</Text>
            <Text style={styles.tableCell}>Total</Text>
          </View>

          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.pro_name}</Text>
              <Text style={styles.tableCell}>{item.pro_price.toFixed(2)} €</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>
                {(item.pro_price * item.quantity).toFixed(2)} €
              </Text>
            </View>
          ))}

          <View style={styles.total}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              Total: {totalAmount.toFixed(2)} €
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Merci pour votre achat !</Text>
          <Text style={{ fontSize: 10, marginTop: 5 }}>
            Pour toute question concernant cette facture, veuillez nous contacter.
          </Text>
        </View>
      </Page>
    </Document>
  );
} 