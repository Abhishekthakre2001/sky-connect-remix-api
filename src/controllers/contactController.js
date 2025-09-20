const EmailService = require("../services/emailService");
const axios = require("axios");

// Get all emails
const getEmails = async (req, res, next) => {
  try {
    const emails = await EmailService.getAllEmails();
    res.json(emails);
  } catch (err) {
    next(err);
  }
};

// Get single email by ID
const getEmail = async (req, res, next) => {
  try {
    const email = await EmailService.getEmailById(req.params.id);
    if (!email) return res.status(404).json({ error: "Email not found" });
    res.json(email);
  } catch (err) {
    next(err);
  }
};


// Create new email entries (single or bulk)
const createEmail = async (req, res, next) => {
  try {
    let data = req.body;

    // Support single object too
    if (!Array.isArray(data)) {
      data = [data];
    }

    const saved = [];
    const failed = [];

    // Loop through all emails
    for (const item of data) {
      try {
        const { shop_id, name, email } = item;

        // Validation
        if (!shop_id || !email) {
          failed.push({
            ...item,
            error: "shop_id and email are required",
          });
          continue; // skip and continue
        }

        // Try save
        const newEmail = await EmailService.createEmail({ shop_id, name, email });
        saved.push(newEmail);
      } catch (err) {
        failed.push({
          ...item,
          error: err.message || "Error saving email",
        });
        continue; // skip and continue
      }
    }

    // Response
    res.status(207).json({
      message: "Bulk insert completed with partial results",
      savedCount: saved.length,
      failedCount: failed.length,
      saved,
      failed,
    });
  } catch (err) {
    next(err);
  }
};


// Update email entry
const updateEmail = async (req, res, next) => {
  try {
    const updatedEmail = await EmailService.updateEmail(req.params.id, req.body);
    if (!updatedEmail) return res.status(404).json({ error: "Email not found" });
    res.json(updatedEmail);
  } catch (err) {
    next(err);
  }
};

// Delete email entry
const deleteEmail = async (req, res, next) => {
  try {
    await EmailService.deleteEmail(req.params.id);
    res.json({ message: "Email deleted" });
  } catch (err) {
    next(err);
  }
};

async function checkSubscription(req, res) {
  const { shop, accessToken } = req.body;

  console.log("Check subscription payload:", req.body);

  if (!shop || !accessToken) {
    return res.status(400).json({ error: "Missing required fields: shop or accessToken" });
  }

  try {
    const query = `
      query {
        currentAppInstallation {
          activeSubscriptions {
            id
            name
            status
          }
        }
      }`;

    const response = await axios.post(
      `https://${shop}/admin/api/2023-04/graphql.json`,
      { query },
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    const { data } = response;
    console.log("Full response data:", data);

    if (data.errors) {
      return res
        .status(400)
        .json({ error: "Failed to fetch subscriptions", details: data.errors });
    }

    const activeSubscriptions = data.data.currentAppInstallation?.activeSubscriptions;

    if (activeSubscriptions && activeSubscriptions.length > 0) {
      return res.json({
        hasSubscription: true,
        subscriptions: activeSubscriptions,
      });
    } else {
      return res.json({
        hasSubscription: false,
        subscriptions: [],
      });
    }
  } catch (error) {
    console.error("Error checking subscription:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function createPriceing(req, res) {
  const { storename, interval, accesstoken } = req.body;

  console.log("Incoming payload:", req.body);

  // ✅ Validate required fields
  if (!storename || !interval || !accesstoken) {
    return res
      .status(400)
      .json({ error: "Missing required fields: storename, interval, or accesstoken" });
  }

  try {
    // Construct shop domain
    const shopDomain = `${storename}`;
    const returnUrl = `https://${shopDomain}/admin/apps/skyconnect/app/contact`;

    // ✅ Define pricing details
    const appRecurringPricingDetails = {
      price: {
        amount:
          interval === "Classic" ? 5.0 :
          interval === "Premium" ? 25.0 : 3.0,
        currencyCode: "USD",
      },
      interval: interval === "Premium" ? "ANNUAL" : "EVERY_30_DAYS",
    };

    // ✅ GraphQL mutation for creating subscription
    const mutation = `
      mutation AppSubscriptionCreate(
        $name: String!,
        $returnUrl: URL!,
        $lineItems: [AppSubscriptionLineItemInput!]!,
        $trialDays: Int
      ) {
        appSubscriptionCreate(
          name: $name,
          returnUrl: $returnUrl,
          lineItems: $lineItems,
          trialDays: $trialDays,
          test: false
        ) {
          userErrors {
            field
            message
          }
          appSubscription {
            id
          }
          confirmationUrl
        }
      }`;

    // ✅ Variables for mutation
    const variables = {
      name:
        interval === "Classic" ? "Classic Plan" :
        interval === "Premium" ? "Premium Plan" :
        "Basic Plan",
      returnUrl,
      lineItems: [
        {
          plan: {
            appRecurringPricingDetails,
          },
        },
      ],
      trialDays: 3, // 3-day trial
    };

    console.log("Variables for mutation:", JSON.stringify(variables, null, 2));

    // ✅ Call Shopify GraphQL API
    const response = await axios.post(
      `https://${shopDomain}/admin/api/2023-04/graphql.json`,
      { query: mutation, variables },
      {
        headers: {
          "X-Shopify-Access-Token": accesstoken,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response from Shopify:", JSON.stringify(response.data, null, 2));

    const shopifyData = response.data;

    // ✅ Handle user errors
    if (
      shopifyData.errors ||
      (shopifyData.data?.appSubscriptionCreate?.userErrors?.length > 0)
    ) {
      return res.status(400).json({
        error: "Failed to create subscription",
        details: shopifyData.errors || shopifyData.data.appSubscriptionCreate.userErrors,
      });
    }

    const confirmationUrl = shopifyData.data?.appSubscriptionCreate?.confirmationUrl;

    if (!confirmationUrl) {
      return res.status(500).json({
        error: "Failed to create subscription. No confirmationUrl returned.",
      });
    }

    // ✅ Success: return billing URL
    return res.json({ billingUrl: confirmationUrl });

  } catch (error) {
    console.error(
      "Error creating subscription:",
      error.response ? error.response.data : error.message
    );
    return res.status(500).json({ error: "Internal server error" });
  }
}


module.exports = {
  getEmails,
  getEmail,
  createEmail,
  updateEmail,
  deleteEmail,
  checkSubscription,
  createPriceing
};
