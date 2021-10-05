Feature:
    As a manager
    I want the functions to pickup the creation of a decision
    So that deciders can be sent emails

    Scenario: Sending of emails when a decision is finalised
        Given there is a POST endpoint at "https://api.sendgrid.com:443/v3/mail/send" which will a status of 200 when called with "sendgrid/decision-finalise.json"
        When there is a decision created using:
            | uid          | aaaaaaaaaaaaaaaaaaaaaaaa                                                             |
            | title        | Title                                                                                |
            | goal         | Goal                                                                                 |
            | background   | Background                                                                           |
            | instructions | Instructions                                                                         |
            | deadline     | 2021-06-06T12:30:00Z                                                                 |
            | deciders     | [{ "email": "example@test.andagree.com", "pending": true, "feedback": "UNDEFINED" }] |
        And call the "DecisionFinalise" function with:
            | decisionId | {{ decision.uid }} |
            | conclusion | Conclusion         |
        Then there is a collection "decisions" with document "{{ decision.uid }}"
        And the document contains:
            | completed  | OBJECT[seconds,nanoseconds] |
            | conclusion | Conclusion                  |
            | status     | ARCHIVED                    |
