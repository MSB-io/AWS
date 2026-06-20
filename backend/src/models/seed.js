const bcrypt = require('bcryptjs');

module.exports = async (models) => {
  const { User, Event, Alert, EngagementRecord } = models;

  try {
    const userCount = await User.count();
    if (userCount > 0) {
      console.log('🌱 Database already seeded. Skipping seeder...');
      return;
    }

    console.log('🌱 Database is empty. Starting seeding process...');

    // 1. Hash passwords
    const adminHash = await bcrypt.hash('admin123', 12);
    const managerHash = await bcrypt.hash('manager123', 12);
    const fanHash = await bcrypt.hash('fan123', 12);

    // 2. Seed Users
    const users = await User.bulkCreate([
      { name: 'Admin User', email: 'admin@fanengage.com', password_hash: adminHash, role: 'admin' },
      { name: 'Event Manager', email: 'manager@fanengage.com', password_hash: managerHash, role: 'manager' },
      { name: 'Priya Sharma', email: 'priya@example.com', password_hash: fanHash, role: 'fan', team_fav: 'Cricket' },
      { name: 'Rahul Verma', email: 'rahul@example.com', password_hash: fanHash, role: 'fan', team_fav: 'Football' },
      { name: 'Ananya Patel', email: 'ananya@example.com', password_hash: fanHash, role: 'fan', team_fav: 'Kabaddi' },
      { name: 'Karan Singh', email: 'karan@example.com', password_hash: fanHash, role: 'fan', team_fav: 'Cricket' },
      { name: 'Sneha Mehta', email: 'sneha@example.com', password_hash: fanHash, role: 'fan', team_fav: 'Badminton' },
    ]);

    console.log(`✅ Seeded ${users.length} users.`);

    // 3. Seed Events
    const events = await Event.bulkCreate([
      {
        title: 'IPL 2025 Final',
        sport: 'Cricket',
        venue: 'Wankhede Stadium, Mumbai',
        event_date: new Date('2025-05-25T19:00:00Z'),
        status: 'live',
        capacity: 35000,
        tickets_sold: 32000,
        home_team: 'MI',
        away_team: 'CSK',
        ticket_price: 2500.00,
      },
      {
        title: 'ISL Semi-Final',
        sport: 'Football',
        venue: 'Salt Lake Stadium, Kolkata',
        event_date: new Date('2025-06-10T17:30:00Z'),
        status: 'upcoming',
        capacity: 68000,
        tickets_sold: 65000,
        home_team: 'ATKMB',
        away_team: 'MCFC',
        ticket_price: 800.00,
      },
      {
        title: 'Pro Kabaddi League Final',
        sport: 'Kabaddi',
        venue: 'EKA Arena, Ahmedabad',
        event_date: new Date('2025-06-20T20:00:00Z'),
        status: 'upcoming',
        capacity: 10000,
        tickets_sold: 8000,
        home_team: 'Gujarat Giants',
        away_team: 'Bengaluru Bulls',
        ticket_price: 499.00,
      },
      {
        title: 'Badminton National Championship',
        sport: 'Badminton',
        venue: 'Siri Fort Sports Complex, Delhi',
        event_date: new Date('2025-04-15T10:00:00Z'),
        status: 'completed',
        capacity: 3200,
        tickets_sold: 3000,
        home_team: '',
        away_team: '',
        ticket_price: 250.00,
      },
      {
        title: 'Pro Basketball League',
        sport: 'Basketball',
        venue: 'NSCI Dome, Mumbai',
        event_date: new Date('2025-07-05T18:00:00Z'),
        status: 'upcoming',
        capacity: 4000,
        tickets_sold: 2400,
        home_team: 'Mumbai Heroes',
        away_team: 'Delhi Dunkers',
        ticket_price: 350.00,
      },
    ]);

    console.log(`✅ Seeded ${events.length} events.`);

    // 4. Seed Alerts
    const alerts = await Alert.bulkCreate([
      {
        type: 'performance',
        message: 'EC2 CPU utilization exceeded 85% threshold for 5 minutes. Consider scaling.',
        severity: 'high',
        resolved: false,
        source: 'CloudWatch',
        created_at: new Date(Date.now() - 12 * 60000),
      },
      {
        type: 'security',
        message: 'Unusual login attempt detected from IP 203.45.67.89. Login blocked by IAM policy.',
        severity: 'critical',
        resolved: false,
        source: 'AWS IAM',
        created_at: new Date(Date.now() - 35 * 60000),
      },
      {
        type: 'event',
        message: 'IPL Final tickets are 91% sold. Only 3,000 tickets remaining.',
        severity: 'medium',
        resolved: false,
        source: 'FanEngage Platform',
        created_at: new Date(Date.now() - 2 * 3600000),
      },
      {
        type: 'system',
        message: 'RDS automated backup completed successfully. Snapshot stored in S3.',
        severity: 'low',
        resolved: true,
        source: 'AWS RDS',
        created_at: new Date(Date.now() - 6 * 3600000),
      },
      {
        type: 'performance',
        message: 'Memory usage on EC2 reached 72%. Monitor for potential issues.',
        severity: 'medium',
        resolved: false,
        source: 'CloudWatch',
        created_at: new Date(Date.now() - 8 * 3600000),
      },
      {
        type: 'system',
        message: 'S3 backup script executed. Daily database backup uploaded successfully.',
        severity: 'low',
        resolved: true,
        source: 'Cron Job',
        created_at: new Date(Date.now() - 24 * 3600000),
      },
    ]);

    console.log(`✅ Seeded ${alerts.length} alerts.`);

    // 5. Seed Engagement Records (grouping them by month for charts)
    // We want records spanning the last 6 months (e.g. Jan to Jun)
    const fanUsers = users.filter(u => u.role === 'fan');
    const actions = ['viewed', 'booked', 'shared', 'favourited'];
    const engagementRecords = [];

    // Let's generate a list of monthly distributions to simulate growth
    // Month 1: 15 records, Month 2: 22 records, Month 3: 35 records, etc.
    const monthsConfig = [
      { monthOffset: 5, count: 12 }, // 5 months ago (Jan)
      { monthOffset: 4, count: 18 }, // 4 months ago (Feb)
      { monthOffset: 3, count: 28 }, // 3 months ago (Mar)
      { monthOffset: 2, count: 42 }, // 2 months ago (Apr)
      { monthOffset: 1, count: 65 }, // 1 month ago (May)
      { monthOffset: 0, count: 88 }, // This month (Jun)
    ];

    for (const config of monthsConfig) {
      for (let i = 0; i < config.count; i++) {
        const randomFan = fanUsers[Math.floor(Math.random() * fanUsers.length)];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];

        // Compute a date in that month
        const targetDate = new Date();
        targetDate.setMonth(targetDate.getMonth() - config.monthOffset);
        // Randomize day in month
        targetDate.setDate(Math.floor(Math.random() * 27) + 1);
        targetDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

        engagementRecords.push({
          user_id: randomFan.id,
          event_id: randomEvent.id,
          action: randomAction,
          session_minutes: Math.floor(Math.random() * 25) + 3,
          created_at: targetDate,
          updated_at: targetDate,
        });
      }
    }

    await EngagementRecord.bulkCreate(engagementRecords);
    console.log(`✅ Seeded ${engagementRecords.length} engagement records.`);
    console.log('🌱 Seeding process complete!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
};
