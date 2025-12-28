import sharp from "sharp";
import { readFileSync } from "fs";
import { join, resolve, basename } from "path";
import yaml from "js-yaml";

// Configuration
const CONFIG = {
  badgeSize: 150, // Size of each badge (square)
  gap: 20, // Gap between badges
  columns: 5, // Badges per row
  badgesDir: "public/badges",
  certificationsConfig: "src/config/certifications.yaml",
  outputFile: "badge-grid.png",
};

interface Certification {
  name: string;
  issuer: string;
  date: string; // Format: YYYY-MM
  tier: number; // 1 = foundational, 2 = associate, 3 = professional
  badge: string;
  certificate?: {
    link: string;
    aspectRatio?: string;
    height?: number;
  };
  url?: string;
}

function parseDate(dateStr: string): Date {
  const [year, month] = dateStr.split("-").map(Number);
  return new Date(year, month - 1);
}

function getOrderedBadgePaths(certifications: Certification[]): string[] {
  // Filter out certifications without valid badges (e.g., DONT-SHOW prefix)
  const validCerts = certifications.filter(
    (cert) => cert.badge && cert.badge.startsWith("/badges/")
  );

  // Group certifications by issuer
  const groupedByIssuer = new Map<string, Certification[]>();
  for (const cert of validCerts) {
    const group = groupedByIssuer.get(cert.issuer) || [];
    group.push(cert);
    groupedByIssuer.set(cert.issuer, group);
  }

  // For each group, find the most recent date and sort internally by tier
  const issuerGroups: {
    issuer: string;
    mostRecent: Date;
    certs: Certification[];
  }[] = [];

  for (const [issuer, certs] of groupedByIssuer) {
    // Find most recent date in this group
    const mostRecent = certs.reduce((latest, cert) => {
      const certDate = parseDate(cert.date);
      return certDate > latest ? certDate : latest;
    }, new Date(0));

    // Sort certs within group by tier (ascending: foundational → professional)
    const sortedCerts = [...certs].sort(
      (a, b) => (a.tier || 99) - (b.tier || 99)
    );

    issuerGroups.push({ issuer, mostRecent, certs: sortedCerts });
  }

  // Sort issuer groups by most recent date (descending: newest first)
  issuerGroups.sort((a, b) => b.mostRecent.getTime() - a.mostRecent.getTime());

  // Flatten to get ordered badge paths
  const orderedBadges: string[] = [];
  for (const group of issuerGroups) {
    console.log(
      `  ${group.issuer}: ${group.certs
        .map((c) => `${c.name} (tier ${c.tier})`)
        .join(", ")}`
    );
    for (const cert of group.certs) {
      // Convert /badges/file.png to just file.png
      orderedBadges.push(basename(cert.badge));
    }
  }

  return orderedBadges;
}

async function generateBadgeGrid() {
  const projectRoot = resolve(import.meta.dirname, "..");
  const badgesDir = join(projectRoot, CONFIG.badgesDir);
  const configPath = join(projectRoot, CONFIG.certificationsConfig);
  const outputPath = join(projectRoot, CONFIG.outputFile);

  // Load certifications from YAML
  const configContent = readFileSync(configPath, "utf-8");
  const certifications = yaml.load(configContent) as Certification[];

  console.log("Loading certifications from config...");

  // Get ordered badge filenames
  const orderedBadges = getOrderedBadgePaths(certifications);

  const badgeFiles = orderedBadges.map((file) => join(badgesDir, file));

  if (badgeFiles.length === 0) {
    console.error("No badge files found in", badgesDir);
    process.exit(1);
  }

  console.log(
    `\nFound ${badgeFiles.length} badges:`,
    badgeFiles.map((f) => f.split("/").pop())
  );

  // Calculate grid dimensions with hexagonal offset
  const { badgeSize, gap, columns } = CONFIG;
  const totalBadges = badgeFiles.length;

  // Calculate rows needed
  const rows: number[][] = [];
  let remaining = totalBadges;
  let rowIndex = 0;

  while (remaining > 0) {
    // Offset rows have one less badge to maintain the honeycomb pattern
    const isOffsetRow = rowIndex % 2 === 1;
    const badgesInThisRow = Math.min(
      remaining,
      isOffsetRow ? columns - 1 : columns
    );
    rows.push(
      Array.from(
        { length: badgesInThisRow },
        (_, i) => rowIndex * columns + i - Math.floor(rowIndex / 2) + i
      )
    );
    remaining -= badgesInThisRow;
    rowIndex++;
  }

  // Calculate canvas dimensions
  const hexOffset = (badgeSize + gap) / 2;
  const canvasWidth = columns * badgeSize + (columns - 1) * gap;
  const canvasHeight = rows.length * badgeSize + (rows.length - 1) * gap;

  console.log(
    `Creating ${canvasWidth}x${canvasHeight} canvas with ${rows.length} rows`
  );

  // Load and resize all badges
  const resizedBadges = await Promise.all(
    badgeFiles.map(async (file) => {
      const buffer = await sharp(file)
        .resize(badgeSize, badgeSize, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();
      return buffer;
    })
  );

  // Build composite operations
  const compositeOperations: sharp.OverlayOptions[] = [];
  let badgeIndex = 0;

  for (let row = 0; row < rows.length; row++) {
    const isOffsetRow = row % 2 === 1;
    const badgesInRow = rows[row].length;

    // For offset rows, start with hexagonal offset
    // Also center the row if it has fewer badges
    const rowOffset = isOffsetRow ? hexOffset : 0;
    const centerOffset =
      isOffsetRow && badgesInRow < columns - 1
        ? ((columns - 1 - badgesInRow) * (badgeSize + gap)) / 2
        : 0;

    for (let col = 0; col < badgesInRow; col++) {
      if (badgeIndex >= resizedBadges.length) break;

      const x = Math.round(rowOffset + centerOffset + col * (badgeSize + gap));
      const y = Math.round(row * (badgeSize + gap));

      compositeOperations.push({
        input: resizedBadges[badgeIndex],
        left: x,
        top: y,
      });

      badgeIndex++;
    }
  }

  // Create the final image
  await sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(compositeOperations)
    .png()
    .toFile(outputPath);

  console.log(`\n✓ Generated badge grid: ${outputPath}`);
  console.log(`  - ${totalBadges} badges in ${rows.length} rows`);
  console.log(`  - Image size: ${canvasWidth}x${canvasHeight}px`);
}

generateBadgeGrid().catch((err) => {
  console.error("Failed to generate badge grid:", err);
  process.exit(1);
});
