Feature:
    As a manager
    I want to be able to call the reminder function
    So that deciders can be sent reminder emails

    Scenario: Sending reminder email for a decision
        Given there is a POST endpoint at "https://api.sendgrid.com:443/v3/mail/send" which will a status of 200 when called with "sendgrid/decision-create.json"
        When there is a decision created using:
            | uid          | aaaaaaaaaaaaaaaaaaaaaaaa                                                             |
            | title        | Title                                                                                |
            | goal         | Goal                                                                                 |
            | background   | Background                                                                           |
            | instructions | Instructions                                                                         |
            | deadline     | 2021-06-06T12:30:00Z                                                                 |
            | managers     | [{ "uid": "bbbbbbbbbbbbbbbbbbbbbbbb", "email": "manager@test.andagree.com" }]        |
            | deciders     | [{ "email": "decider@test.andagree.com", "pending": true, "feedback": "UNDEFINED" }] |
            | viewers      | [{ "uid": "cccccccccccccccccccccccc", "email": "viewer@test.andagree.com"}]          |
            | creator      | { "uid": "dddddddddddddddddddddddd", "email": "creator@test.andagree.com" }          |
            | status       | PENDING                                                                              |
        And call the "DecisionReminder" function with:
            | decisionId | {{ decision.uid }} |
