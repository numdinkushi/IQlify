import { jsPDF } from 'jspdf';

interface CertificateData {
    userName: string;
    walletAddress: string;
    totalInterviews: number;
    averageScore: number;
    totalEarnings: number;
    currentStreak: number;
    rank: number;
    issueDate: string;
}

export async function generateCertificate(data: CertificateData): Promise<void> {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [297, 210] // A4 landscape
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const centerX = pageWidth / 2;

    // Colors
    const goldColor: [number, number, number] = [212, 175, 55]; // #D4AF37
    const darkGray: [number, number, number] = [30, 30, 30];
    const lightGray: [number, number, number] = [100, 100, 100];

    // Background gradient effect (simulated with rectangles)
    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Decorative border
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Inner border
    doc.setLineWidth(0.5);
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Header section
    const headerY = 30;

    // Logo placeholder (you can replace this with actual logo image)
    doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.circle(centerX, headerY, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('IQ', centerX, headerY + 2);

    // Title
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATE OF COMPETENCE', centerX, headerY + 40, { align: 'center' });

    // Subtitle
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text('This is to certify that', centerX, headerY + 55, { align: 'center' });

    // Recipient name
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    const nameY = headerY + 75;
    doc.text(data.userName || data.walletAddress.slice(0, 6) + '...' + data.walletAddress.slice(-4), centerX, nameY, { align: 'center' });

    // Achievement text
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text('has demonstrated exceptional competence in technical interviews', centerX, nameY + 20, { align: 'center' });
    doc.text('through consistent practice and outstanding performance on IQlify', centerX, nameY + 30, { align: 'center' });

    // Stats section
    const statsY = nameY + 55;
    const statsSpacing = 35;
    let statsX = centerX - (statsSpacing * 1.5);

    // Total Interviews
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text(data.totalInterviews.toString(), statsX, statsY, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text('Interviews', statsX, statsY + 8, { align: 'center' });

    // Average Score
    statsX += statsSpacing;
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text(data.averageScore.toFixed(1) + '%', statsX, statsY, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text('Avg Score', statsX, statsY + 8, { align: 'center' });

    // Total Earnings
    statsX += statsSpacing;
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text(data.totalEarnings.toFixed(2), statsX, statsY, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text('CELO Earned', statsX, statsY + 8, { align: 'center' });

    // Current Streak
    statsX += statsSpacing;
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text(data.currentStreak.toString(), statsX, statsY, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text('Day Streak', statsX, statsY + 8, { align: 'center' });

    // Rank
    statsX += statsSpacing;
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text('#' + data.rank.toString(), statsX, statsY, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text('Global Rank', statsX, statsY + 8, { align: 'center' });

    // Footer section
    const footerY = pageHeight - 40;

    // Issue date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text(`Issued on: ${data.issueDate}`, centerX, footerY, { align: 'center' });

    // Verification text
    doc.setFontSize(8);
    doc.text('Verify this certificate at iqlify.app', centerX, footerY + 10, { align: 'center' });
    doc.text(`Wallet: ${data.walletAddress}`, centerX, footerY + 15, { align: 'center' });

    // Decorative elements
    // Left decorative line
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setLineWidth(1);
    doc.line(30, footerY - 5, 80, footerY - 5);
    doc.line(30, footerY - 3, 80, footerY - 3);

    // Right decorative line
    doc.line(pageWidth - 80, footerY - 5, pageWidth - 30, footerY - 5);
    doc.line(pageWidth - 80, footerY - 3, pageWidth - 30, footerY - 3);

    // Save the PDF
    const fileName = `IQlify_Certificate_${data.userName || data.walletAddress.slice(0, 6)}_${Date.now()}.pdf`;
    doc.save(fileName);
}

